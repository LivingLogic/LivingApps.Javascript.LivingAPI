LivingAPI
#########

The Javascript SDK for LivingApps
=================================

This package provides a Javascript API for the LivingApps system (see
`http://www.living-apps.de/ <http://www.living-apps.de/>`__) or
`http://www.living-apps.com/ <http://www.living-apps.de/>`__ for more
information).

It allows you to fetch the configured data sources from a template,
create new records and update and delete existing records all from you
script.

LivingApps also provides a Python SDK. `click here for more
Information <https://github.com/LivingLogic/LivingApps.Python.LivingAPI/>`__

For more info about LivingApps and this Javascript SDK, see
https://my.living-apps.de/docs/JavascriptSDK.html (in german).


Changes
=======

0.6.0 (2019/04/24)
------------------

Registered ``FlashMessage`` with the UL4ON machinery (this shouldn't be
necessary as flash messages should be consumed by the HTML page itself). Moving
them over to Javascript might make sense for reactive frameworks but currently
this doesn't clear the list of flash messages in the server.


Authors
=======

- Walter Dörwald <walter@livinglogic.de>: ``ul4.js`` and ``livingapi.js``

- René Schwarzinger (milleniumfrog): modifications in ``livingapi.js``

- Peter Böker <peter@livinglogic.de>: modifications in ``livingapi.js``
