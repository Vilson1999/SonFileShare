#!/bin/sh

#
# Copyright 2015 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

warn () {
    echo "$*"
} >&2

die () {
    echo
    echo "$*"
    echo
    exit 1
} >&2

# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
else
    JAVACMD="java"
fi

if ! which "$JAVACMD" >/dev/null 2>&1 ; then
    die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH."
fi

# Locate the Gradle wrapper jar or fall back to system gradle
DIRNAME=`dirname "$0"`
WRAPPER_JAR="$DIRNAME/gradle/wrapper/gradle-wrapper.jar"

if [ -f "$WRAPPER_JAR" ]; then
    exec "$JAVACMD" -jar "$WRAPPER_JAR" "$@"
elif which gradle >/dev/null 2>&1 ; then
    exec gradle "$@"
else
    # Download wrapper jar on the fly if needed
    mkdir -p "$DIRNAME/gradle/wrapper"
    echo "Downloading gradle-wrapper.jar..."
    if which curl >/dev/null 2>&1 ; then
        curl -sLo "$WRAPPER_JAR" "https://raw.githubusercontent.com/gradle/gradle/v8.9.0/gradle/wrapper/gradle-wrapper.jar"
    elif which wget >/dev/null 2>&1 ; then
        wget -qO "$WRAPPER_JAR" "https://raw.githubusercontent.com/gradle/gradle/v8.9.0/gradle/wrapper/gradle-wrapper.jar"
    fi
    if [ -f "$WRAPPER_JAR" ]; then
        exec "$JAVACMD" -jar "$WRAPPER_JAR" "$@"
    else
        die "ERROR: Could not find or download gradle-wrapper.jar."
    fi
fi
