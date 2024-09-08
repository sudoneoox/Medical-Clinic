#!/bin/bash
FILENAME=$1
pg_dump -U $USER -d medical_clinic -s > $FILENAME.sql