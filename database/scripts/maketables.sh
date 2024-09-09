#!/bin/bash
FILENAME=$1
sudo -u postgres psql -d medical_clinic -f $FILENAME