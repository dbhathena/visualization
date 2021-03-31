from django.db import models

# Create your models here.


class PhysData(models.Model):
    name = models.CharField(null=True, max_length=4)
    date = models.DateTimeField(null=True)
    category = models.CharField(null=True, max_length=200)
    hand = models.CharField(null=True, max_length=5)
    interval = models.CharField(null=True, max_length=10)
    measurement = models.FloatField(null=True)
    fraction = models.FloatField(null=True)
    group = models.CharField(null=True, max_length=200)

    def __str__(self):
        return "Date: " + str(self.date) + " Measurement: " + str(self.measurement)

    def __hash__(self):
        return hash((self.name, self.date, self.category, self.interval, self.measurement))

class DepData(models.Model):
    name = models.CharField(null=True, max_length=4)
    date = models.DateTimeField(null=True)
    category = models.CharField(null=True, max_length=200)
    interval = models.CharField(null=True, max_length=10)
    measurement = models.FloatField(null=True)
    group = models.CharField(null=True, max_length=200)

    def __str__(self):
        return "Date: " + str(self.date) + " Measurement: " + str(self.measurement)

    def __hash__(self):
        return hash((self.name, self.date, self.category, self.interval, self.measurement))


class PhoneData(models.Model):
    name = models.CharField(null=True, max_length=4)
    date = models.DateTimeField(null=True)
    category = models.CharField(null=True, max_length=200)
    interval = models.CharField(null=True, max_length=10)
    measurement = models.FloatField(null=True)
    group = models.CharField(null=True, max_length=200)

    def __str__(self):
        return "Date: " + str(self.date) + " Measurement: " + str(self.measurement)

    def __hash__(self):
        return hash((self.name, self.date, self.category, self.interval, self.measurement))




class WeatherData(models.Model):
    name = models.CharField(null=True, max_length=4)
    date = models.DateTimeField(null=True)
    category = models.CharField(null=True, max_length=200)
    measurement = models.FloatField(null=True)
    group = models.CharField(null=True, max_length=200)
    interval = models.CharField(default='24hrs', max_length=10)

    def __str__(self):
        return "Date: " + str(self.date) + " Measurement: " + str(self.measurement)

    def __hash__(self):
        return hash((self.name, self.date, self.category, self.measurement))


class SleepData(models.Model):
    name = models.CharField(max_length=4)
    date = models.DateTimeField()
    category = models.CharField(max_length=20)
    is_asleep = models.NullBooleanField()
    interval = models.CharField(default='10mins', max_length=10)
    regularity = models.FloatField(null=True)

    def __str__(self):
        return "Participant: " + str(self.name) + "Date: " + str(self.date) + " Is asleep: " + str(self.is_asleep)

    def __hash__(self):
        return hash((self.name, self.date, self.category, self.is_asleep))


class DemographicData(models.Model):
    ethnicity_choices = [('hispanic', 'Hispanic or Latino'),
                         ('non-hispanic', 'Non-Hispanic or Latino')]
    study_group_choices = [('MDD', 'Major Depressive Disorder'),
                           ('HC', 'Healthy Control')]
    sex_choices = [('male', 'Male'),
                   ('female', 'Female')]

    name = models.CharField(max_length=4, null=False)
    age = models.FloatField(null=False)
    in_psychotherapy = models.NullBooleanField()
    number_trials = models.FloatField(null=False)
    ethnicity = models.CharField(max_length=50, null=False, choices=ethnicity_choices)
    is_white = models.BooleanField(null=False)
    is_black_african_american = models.BooleanField(null=False)
    is_asian = models.BooleanField(null=False)
    is_hawaiian_pacific_islander = models.BooleanField(null=False)
    is_american_indian_alaska_native = models.BooleanField(null=False)
    is_other_race = models.BooleanField(null=False)
    treatment_length = models.FloatField(null=False)
    study_group = models.CharField(null=False, max_length=7, choices=study_group_choices)
    sex = models.CharField(null=False, max_length=7, choices=sex_choices)


class SitePrivileges(models.Model):

    class Meta:

        managed = False

        permissions = (
            ("aggregate", "Can view aggregate data"),
            ("individual", "Can view specific individual data"),
            ("study1", "Can view GCS study data"),
            ("study2", "Can view followup study data"),
            ('android_user', "Android User"),
            ('nonandroid_user', "NonAndroid User")
        )
