# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2023-03-26 22:59
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Gym', '0003_auto_20230326_1559'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkin_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('checkout_time', models.DateTimeField(blank=True, null=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Gym.Location')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GymUsage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Daily.Entry')),
                ('equipment', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Gym.Equipment')),
            ],
        ),
    ]
