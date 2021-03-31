from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viz_app', '0055_alldata'),
    ]

    dependencies = [
        ('viz_app', '0055_alldata'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='siteprivileges',
            options={'managed': False, 'permissions': (('aggregate', 'Can view aggregate data'), ('individual', 'Can view specific individual data'), ('study1', 'Can view GCS study data'), ('study2', 'Can view followup study data'), ('android_user', 'Android User'), ('nonandroid_user', "NonAndroid User"))},
        ),
    ]
