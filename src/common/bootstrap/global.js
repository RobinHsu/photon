import fs from 'fs';
import path from 'path';

const photon = {};

/**
 * is installed
 * @type {Bollean}
 */
photon.isInstalled = false;

try {
  const installedFile = think.ROOT_PATH + path.sep + '.installed';
  if (fs.accessSync && fs.accessSync(installedFile, fs.F_OK)) {
    photon.isInstalled = true;
  }
  if (fs.existsSync(installedFile)) {
    photon.isInstalled = true;
  }
} catch (e) {
  // fs.accessSync failed
}

/**
 * set ap is installed
 */
photon.setInstalled = () => {
  photon.isInstalled = true;
  const installFile = think.ROOT_PATH + path.sep + '.installed';
  fs.writeFileSync(installFile, 'photon');
};

global.photon = photon;
