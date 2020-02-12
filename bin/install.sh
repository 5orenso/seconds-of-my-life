#!/bin/bash

set -e;

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
    DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

# Read command line input:
while [[ $# > 0 ]]; do
    key="$1"
    case $key in
        -h|--help)
            HELP="true"
        ;;
        -d|--dir)
            INSTALL_DIR="$2"
            shift # past argument
        ;;
        *)
            # unknown option
        ;;
    esac
    shift # past argument or value
done

if [ ! -z "$HELP" ]; then
    echo "bash ${0} - help"
    echo "    [-h|--help]"
    echo "    [-d|--dir]"
    echo ""
    echo "This script will create a copy of all this files you need to make your own"
    echo "nice preact widget."
    echo ""
    echo "Example usage:"
    echo "     $ bash ${0} --dir ~/my-first-preact-widget/"
    echo ""
    exit 1;
fi

if [ -z "${INSTALL_DIR}" ]; then
    echo ">> Error! Missing install dir."
    echo ""
    exit 1;
fi

echo "Installing into ${INSTALL_DIR}"

# Make paths we need
/bin/mkdir -p $INSTALL_DIR

# Copying paths
/bin/cp -Rv src $INSTALL_DIR/.
/bin/cp -Rv bin $INSTALL_DIR/.
/bin/cp -Rv __tests__ $INSTALL_DIR/.

# Copying files
/bin/cp -v .babelrc $INSTALL_DIR/.
/bin/cp -v .eslintignore $INSTALL_DIR/.
/bin/cp -v .eslintrc.json $INSTALL_DIR/.
/bin/cp -v .gitignore $INSTALL_DIR/.
/bin/cp -v .travis.yml $INSTALL_DIR/.
/bin/cp -v changelog.sh $INSTALL_DIR/.
/bin/cp -v CONTRIBUTING.md $INSTALL_DIR/.
/bin/cp -v LICENSE $INSTALL_DIR/.
/bin/cp -v npm-release.sh $INSTALL_DIR/.
/bin/cp -v package-lock.json $INSTALL_DIR/.
/bin/cp -v package.json $INSTALL_DIR/.
/bin/cp -v preact.config.js $INSTALL_DIR/.
/bin/cp -v README.md $INSTALL_DIR/.

cd $INSTALL_DIR
