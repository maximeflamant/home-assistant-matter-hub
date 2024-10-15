# Home-Assistant-Matter-Hub

This project simulates bridges to publish your entities from Home
Assistant to any Matter-compatible controller like Alexa, Apple Home
or Google Home. Using Matter, those can be connected easily using
local communication without the need of port forwarding etc.

## 1. Installation

This application can be installed in three different ways:

1. Home-Assistant AddOn for Home Assistant OS (preferred)
2. Ready to use Docker Image
3. Manual installation using `npm`

### 1.1 Native Home-Assistant AddOn

> [!WARNING]
> Home Assistant AddOns can only be used with Home Assistant OS.

Simply add the following GitHub Repository URL to your Home Assistant AddOn Store.

> https://github.com/t0bst4r/home-assistant-matter-hub

1. Open the UI of your Home Assistant instance
2. Go to `Settings` -> `Add-Ons` -> `Add-On Store`
3. Click the three dots in the top-right corner and select `Repositories`
4. Paste the repository URL into the text-field and click "Add"
5. Refresh your Add-On Store and Install the Add-On
6. You can configure the log level and the port of the Web UI in the AddOn configuration page

### 1.2 Docker Image

This repository builds a docker image for every release. You can simply pull it with

```bash
docker pull ghcr.io/t0bst4r/home-assistant-matter-hub:latest
```

In the docker image the application stores its data in `/data`, so you can mount a volume there to
persist it, but you could change that by setting the `HAMH_STORAGE_LOCATION` variable.

Additionally, you have to configure the container as follows:

```bash
docker run -d \
  # required: the address of your home assistant instance
  -e HAMH_HOME_ASSISTANT_URL="http://192.168.178.123:8123/" \
  # required: a long lived access token for your home assistant instance
  -e HAMH_HOME_ASSISTANT_ACCESS_TOKEN="eyJ.....dlc" \
  # optional: debug | info | warn | error
  # default: info
  -e HAMH_LOG_LEVEL="info" \
  # optional: the port to use for the web ui
  # default: 8482
  -e HAMH_WEB_PORT=8482 \
  # recommended: persist the configuration and application data
  -v $PWD/home-assistant-matter-hub:/data \
  # required due to restrictions in matter
  --network=host \
  ghcr.io/t0bst4r/home-assistant-matter-hub:latest
```

### 1.3 Manual installation using `npm`

If you want to install this application by hand, you simply need to run

```bash
npm install -g home-assistant-matter-hub
```

To start the application, run

```bash
home-assistant-matter-hub start \
  # required: the address of your home assistant instance
  # can be replaced with an environment variable: HAMH_HOME_ASSISTANT_URL
  --home-assistant-url="http://192.168.178.123:8123/" \
  # required: a long lived access token for your home assistant instance
  # can be replaced with an environment variable: HAMH_HOME_ASSISTANT_ACCESS_TOKEN
  --home-assistant-access-token="eyJ.....dlc" \
  # optional: debug | info | warn | error
  # default: info
  # can be replaced with an environment variable: HAMH_LOG_LEVEL
  --log-level=info \
  # optional: the port to use for the web ui
  # default: 8482
  # can be replaced with an environment variable: HAMH_WEB_PORT
  --web-port=8482
```

The application will store its data in `$HOME/.home-assistant-matter-hub`. You can configure the storage path by
using the `--storage-location=/path/to/storage` option or `HAMH_STORAGE_STORAGE` environment variable.

## 2. Configuration

Due to its advanced configuration options it is not possible to simply configure everything with environment variables
or command line parameters. The following parameters are available:

```
home-assistant-matter-hub start

start the application

Options:
  --help                         Show help                                                             [boolean]

  --log-level                    Set the log level                                                      [string]
                                 choices: "debug", "info", "warn", "error"
                                 default: "info"

  --disable-log-colors           Disable colors in the logs (default: false)                           [boolean]

  --storage-location             Path to a directory where the application should store its data.
                                 (default: ~/.home-assistant-matter-hub)                                [string]

  --web-port                     Port used by the web application (default: 8482)                       [number]

  --home-assistant-url           The HTTP-URL of your Home Assistant URL                     [string] [required]

  --home-assistant-access-token  A long-lived access token for your Home Assistant Instance  [string] [required]
```

Using the User Interface you can set up multiple bridges and configure each to use different filters for your entities.
Each bridge will be completely independent of the others and uses its own port for matter.

> [!NOTE]
> You can use **one** bridge to connect to **multiple** controllers.

> [!WARNING]
> Alexa only supports port `5540`. Therefore, you cannot create multiple bridges to connect with Alexa.