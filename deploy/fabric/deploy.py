from fabric.api import run, cd, sudo, get, put, env, local
from fabric.contrib.files import exists
import time, re
import tempfile
import os, sys

sys.path.append("/Users/noahfaro/Documents/SzymonUROP/visualization/")
from src.viz_platform import settings
from src import passwords

import pipes

import os
FILE_DIRECTORY = os.path.dirname(os.path.realpath(__file__))

USERNAME = passwords.LINUX_USERNAME
USER_PASSWORD = passwords.LINUX_PASSWORD
GIT_PROJECT_NAME = passwords.GIT_PROJECT_NAME
MYSQL_ROOT_PASSWORD = passwords.MYSQL_ROOT_PASSWORD


env.user = USERNAME
# env.use_ssh_config = True
env.password = USER_PASSWORD
env.key_filename = 'deploy/fabric/keys/sshkey'

SETUP_DIRECTORY = "/opt/"
CODE_HOME = SETUP_DIRECTORY + GIT_PROJECT_NAME + "/"

DIRECTORIES_TO_CREATE = ()

GITHUB_SSH_URL = passwords.GITHUB_SSH_URL


def deploy():

    with cd(CODE_HOME):

        run("git reset --hard")
        run("git clean -f -d")
        run("git pull")

        sudo('pip3 install -r requirements.txt')

        run('cp /opt/passwords.py src')

        sudo("python3 src/manage.py collectstatic --noinput", user="www-data")

        sudo("python3 src/manage.py migrate", user="www-data")

    sudo('service uwsgi restart')

def deploy_crontab():
    put( os.path.join(FILE_DIRECTORY, '../crontab'), '/tmp/crontab')
    sudo('crontab < /tmp/crontab')

def deploy_passwords_file():
    put( os.path.join(FILE_DIRECTORY, '../../src/passwords.py'), '/opt/passwords.py')
    sudo('crontab < /tmp/crontab')

def setup_server():

    sudo('apt-get update')

    sudo("debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password {0}'".format(MYSQL_ROOT_PASSWORD))
    sudo("debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password {0}'".format(MYSQL_ROOT_PASSWORD))

    # get the programs we'll need
    sudo('apt-get -y install libmysqlclient-dev python-setuptools git nginx uwsgi uwsgi-plugin-python mysql-server python3-mysqldb')
    sudo('apt-get -y install python-pip python3-dev build-essential')
    sudo('apt-get -y install yui-compressor')
    sudo('apt-get -y install node-less')
    sudo('apt-get -y install python3.5')
    sudo('apt-get -y install python3-pip libffi-dev')
    sudo('pip3 install mysqlclient')
    sudo('pip3 install uwsgi')

    # get code
    sudo('mkdir -p ' + SETUP_DIRECTORY)
    sudo('chown deploy:www-data ' + SETUP_DIRECTORY)
    for d in DIRECTORIES_TO_CREATE:
        sudo('mkdir -p ' + d)
        sudo('chown deploy:www-data ' + d)
        sudo('chmod g+w ' + d)

    with cd(SETUP_DIRECTORY):
        # TODO: create deploy git user, and set up their auth
        run('git config --global user.name "Deploy"')
        sudo('mkdir -p /home/{0}/.ssh/'.format(USERNAME))
        _put_key_file('github_rsa')
        _put_key_file('github_rsa.pub')


        for command in _get_configure_db_commands(MYSQL_ROOT_PASSWORD):
            run(command)
        sudo('chmod 777 .')

        run('find "github.com" ~/.ssh/config 1>nul || echo -e "Host github.com\n    User git\n    IdentityFile ~/.ssh/github_rsa" > ~/.ssh/config')
        run('[ -d {0} ] || git clone '.format(GIT_PROJECT_NAME) + GITHUB_SSH_URL)
        run('ln -s {0} django'.format(GIT_PROJECT_NAME))

        put('{0}/nginx-default-conf'.format(os.path.dirname(FILE_DIRECTORY)), '/etc/nginx/sites-enabled/default', use_sudo=True)
        put('{0}/nginx-conf'.format(os.path.dirname(FILE_DIRECTORY)), '/etc/nginx/nginx.conf', use_sudo=True)
        put('{0}/uwsgi-conf'.format(os.path.dirname(FILE_DIRECTORY)), '/etc/init/uwsgi.conf', use_sudo=True)

        run('rm -rf data')

    sudo('mkdir -p /opt/staticfiles')
    sudo('chown www-data:www-data /opt/staticfiles')
    sudo('mkdir -p /opt/media')
    sudo('chown www-data:www-data /opt/media')

    sudo('mkdir -p /var/log/django/')
    sudo('chown www-data:www-data /var/log/django/')
    sudo('touch /var/log/django/django.log')
    sudo('chown www-data:www-data /var/log/django/django.log')
    sudo('chmod 777 /var/log/django/')
    sudo('service nginx restart')

    put_passwords_file()

    put_data_file()

    deploy()

def create_superuser():

    with cd(CODE_HOME):
        sudo("python src/manage.py createsuperuser", user="www-data")

def dbshell_server():

    with cd(CODE_HOME):
        run("python src/manage.py dbshell")

def tail_log():

    with cd(CODE_HOME):

        sudo("tail -n100 /var/log/django/django.log", user="www-data")


def _put_key_file(localkeyname):
    localpath = os.path.join(FILE_DIRECTORY, 'keys', localkeyname)
    print("THIS IS THE KEY: " + localpath)
    put(localpath, '/home/{0}/.ssh/'.format(USERNAME))
    sudo('chmod 600 /home/{0}/.ssh/{1}'.format(USERNAME, localkeyname))


def _get_configure_db_commands(root_password):
    # configure our db
    username = settings.DATABASES['default']['USER']
    db = settings.DATABASES['default']['NAME']
    password = settings.DATABASES['default']['PASSWORD']

    if root_password:
        root_password = "-p" + root_password

    commands = (
        "mysql -uroot {0} -e 'CREATE DATABASE IF NOT EXISTS {1}'".format(root_password, db),
        "mysql -uroot {0} -e 'GRANT ALL PRIVILEGES ON {2}.* TO {3}@localhost IDENTIFIED BY \"{1}\"'".format(root_password,password, db, username),
        "mysql -uroot {0} -e 'FLUSH PRIVILEGES'".format(root_password),
    )
    return commands


def configure_local_db():

    for command in _get_configure_db_commands(""):
        local(command)

    print("MySQL configured successfully!")

def put_passwords_file():
    passwords_path = os.path.join(FILE_DIRECTORY, '..', '..', 'src', 'passwords.py')
    put(passwords_path, "/opt")

def put_data_file():
    data_path = os.path.join(FILE_DIRECTORY, '..', '..', '..', 'data')
    put(data_path, "/opt")
