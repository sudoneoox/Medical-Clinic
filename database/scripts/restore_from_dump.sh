#!/bin/bash
FILENAME=$1
psql -U $USER -d medical_clinic < $FILENAME.sql