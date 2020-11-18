import os, sys
import random
from hashlib import sha1

def hash_password():
    pass

def get_data(resource, data_def):
    """
    Return data as defined in data_def
    from resource
    """
    data = {}
    for ddef in data_def.keys():
        if hasattr(resource, ddef):
            data[ddef] = data_def[ddef]
        else:
            data[ddef] = None
    return data
