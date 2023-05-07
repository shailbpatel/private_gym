# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2023-05-06 17:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0005_auto_20230326_1559'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membership',
            name=b'location',
        ),
        migrations.AddField(
            model_name='membership',
            name='is_free_trial',
            field=models.BooleanField(default=False),
        ),
    ]