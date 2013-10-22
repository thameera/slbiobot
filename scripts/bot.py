#!/usr/bin/env python

# SL Bio Bot

import os
import sys
import re
import urllib
import twitter
import ConfigParser
from collections import namedtuple
from optparse import OptionParser
from random import randint

USER_LIST_FILE='users.txt'
CONFIG_FILE='configs.txt'
EXCLAMS=['Lookie!', 'Hey look!', 'Bang!', 'Wheee!']
MAX_REQ=100  # Maximum num of users to lookup in a single query. Max allowed is 100.

users = []
bios = {}
shouldWrite = False

Change = namedtuple("Change", "user old new")

def getRandomExclam():
    return EXCLAMS[randint(0, len(EXCLAMS)-1)]

def loadUserList():
    global users
    global bios

    if not os.path.exists(USER_LIST_FILE):
        sys.stderr.write("User file [%s] not found. Exiting...\n" % USER_LIST_FILE)
        sys.stderr.flush()
        sys.exit(1)

    try:
        fh = open(USER_LIST_FILE, 'r')
    except IOError, e:
        sys.stderr.write("User list file coud not be opened: %s\n" % e)
        sys.stderr.flush()
        sys.exit(1)

    # Read the user file and populate users and bios
    while 1:
        name = fh.readline().strip()
        if not name: break
        bio = fh.readline().strip()
        name = name.lower()
        if name in users:
            sys.stderr.write("Duplicate detected: %s\n" % name)
            sys.stderr.flush()
            continue
        users.append(name)
        bios[name] = bio

    fh.close()

def writeUserList():
    global users
    global bios

    try:
        fh = open(USER_LIST_FILE, 'w')
    except IOError, e:
        sys.stderr.write("User file could not be opened for reading. %s\n" % e)
        sys.stderr.flush()
        sys.exit(1)

    users.sort()

    for u in users:
        fh.write("%s\n" % u)
        fh.write("%s\n" % bios[u])

    fh.close()

# Main function that checks twitter for bio changes
def lookupUsers():
    global users
    global bios
    global api
    global shouldWrite

    # Segment the users list to chunks of MAX_REQ. This should be <=100
    # Each user lookup call to Twitter API sends a chunk of MAX_REQ users
    tmp = users
    segs = []
    while tmp:
        segs.append(tmp[:MAX_REQ])
        tmp = tmp[MAX_REQ:]

    changes = []

    for seg in segs:
        results = api.UsersLookup(screen_name=seg)

        # Some names might be missing from the results
        # eg: some idiots change their screen names from time to time
        if len(seg) != len(results):
            sys.stderr.write("Missing names detected: %d vs %d\n"% (len(seg), len(results)))
            reslist = list(res.screen_name.lower() for res in results)
            # Get the list of names that we requested but was absent in the results
            missing = [x for x in seg if x not in reslist] # pissu hadenawa
            sys.stderr.write("Missing   : %s\n" % str(missing))
            sys.stderr.flush()
            # This ain't fatal, so we can continue with the available results

        # Iterate the results from twitter
        for res in results:
            scname = res.screen_name.lower()
            desc = res.description.encode('utf-8')
            desc = urllib.quote(desc)
            desc = re.sub('/', '%2F', desc) # encode forward slashes in urls 

            # When adding new names to the list, their bios are set to -
            # Not considering these as changes, but should be written to file
            if bios[scname] == '-':
                print "New entry %s" % scname
                shouldWrite = True
                bios[scname] = desc

            # There's a change!
            elif bios[scname] != desc:
                print "Changed! %s" % scname
                shouldWrite = True

                old = bios[scname]
                if not old: old = '-' # Fix for blank URLs

                bios[scname] = desc  # Update dictionary
                if not desc: desc = '-' # Fix for blank URLs

                # Add to list of changes
                changes.append(Change(scname, old, desc))
            else:
                pass

    return changes

def tweet(changes):
    global api

    for ch in changes:
        exclam = getRandomExclam()
        url = "http://slbiobot.herokuapp.com/d/%s/%s/%s" % (ch.user, ch.old, ch.new)
        tw = "%s @%s has changed the bio! %s" % (exclam, ch.user, url)
        api.PostUpdate(tw)

# __main__

### Parse command-line args ###
parser = OptionParser()
# -d option for dryrun. File will be updated, but nothing tweeted.
parser.add_option("-d", "--dryrun", action="store_true", dest="dry", default=False, help="If specified, output won't be tweeted")
# -f for full dryrun. File not updated, nothing tweeted.
parser.add_option("-f", "--fulldryrun", action="store_true", dest="fdry", default=False, help="If specified, output won't be written or tweeted")

(options, args) = parser.parse_args()

### Read configs ###
config = ConfigParser.ConfigParser()
config.read(CONFIG_FILE)
section = "Twitter"
configs=config.options(section)

keys = []
for cfg in configs:
    keys.append(config.get(section, cfg))

# Connect to twitter
api = twitter.Api(consumer_key=keys[0], 
                consumer_secret=keys[1], 
                access_token_key=keys[2],
                access_token_secret=keys[3])

# Load existing users, bios
loadUserList()

# Check for changes
changes = lookupUsers()

# Take action!
if not options.fdry:
    if shouldWrite: 
        writeUserList()
        if not options.dry:
            tweet(changes)
        else:
            print "Not tweeting in dry run mode"
    else:
        print "Nothing to write or tweet"
else:
    print "Not writing or tweeting in full dry run mode"

