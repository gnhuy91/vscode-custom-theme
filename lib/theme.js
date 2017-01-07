'use strict'

const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
const config = require('./config')

const baseDir = _basePath()
const cssPath = baseDir + _genericPath(config.path.css)
const jsPath = baseDir + _genericPath(config.path.js)

module.exports = {
  apply,
  reset
}

function apply() {
  const settings = vscode.workspace.getConfiguration('theme')
  if (settings.integrity.enabled === false) {
    _setIntegrityCheck(false)
  }
  _setTheme(settings)
  _reload()
}

function reset() {
  _setTheme(config.default)
  _setIntegrityCheck(true)
  _reload()
}

function _reload() {
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

function _basePath() {
  // vscode 1.7 and below
  const oldPath = path.dirname(require.main.filename) + _genericPath(config.path.base)
  // from vscode 1.8
  const newPath = oldPath + _genericPath(config.path.electron)
  return fs.existsSync(oldPath + _genericPath(config.path.css)) ? oldPath : newPath
}

function _genericPath(path) {
  return /^win/.test(process.platform) ? path.replace(/\//g, '\\\\') : path
}

function _setIntegrityCheck(active) {
  let js = fs.readFileSync(jsPath, config.encoding)
  js = active
    ? js.replace(config.regex.integrity.off, config.regex.integrity.on)
    : js.replace(config.regex.integrity.on, config.regex.integrity.off)
  fs.writeFileSync(jsPath, js, config.encoding)
}

function _setTheme(settings) {
  let css = fs.readFileSync(cssPath, config.encoding)
  css = _setActivitybar(settings, css)
  css = _setFiletree(settings, css)
  css = _setTabs(settings, css)
  css = _setStatusbar(settings, css)
  css = _setFeedback(settings, css)
  fs.writeFileSync(cssPath, css, config.encoding)
}

function _setActivitybar(settings, theme) {
  theme = theme.replace(config.regex.activitybar.backgroundDark, `$1${settings.dark.activitybar.background.color}$3`)
  theme = theme.replace(config.regex.activitybar.backgroundLight, `$1${settings.light.activitybar.background.color}$3`)
  return theme
}

function _setFiletree(settings, theme) {
  theme = theme.replace(config.regex.filetree.backgroundDark, `$1${settings.dark.filetree.background.color}$3`)
  theme = theme.replace(config.regex.filetree.backgroundLight, `$1${settings.light.filetree.background.color}$3`)
  theme = theme.replace(config.regex.filetree.toolboxDark, `$1${settings.dark.filetree.background.color}$3`)
  theme = theme.replace(config.regex.filetree.toolboxLight, `$1${settings.light.filetree.background.color}$3`)
  return theme
}

function _setTabs(settings, theme) {
  theme = theme.replace(config.regex.tabs.backgroundDark, `$1${settings.dark.tabs.background.color}$3`)
  theme = theme.replace(config.regex.tabs.backgroundLight, `$1${settings.light.tabs.background.color}$3`)
  theme = theme.replace(config.regex.tabs.border.leftDark, `$1${settings.dark.tabs.border.color}$3`)
  theme = theme.replace(config.regex.tabs.border.leftLight, `$1${settings.light.tabs.border.color}$3`)
  theme = theme.replace(config.regex.tabs.border.rightDark, `$1${settings.dark.tabs.border.color}$3`)
  theme = theme.replace(config.regex.tabs.border.rightLight, `$1${settings.light.tabs.border.color}$3`)
  theme = theme.replace(config.regex.tabs.toolbox.backgroundDark, `$1${settings.dark.tabs.toolbox.background.color}$3`)
  theme = theme.replace(config.regex.tabs.toolbox.backgroundLight, `$1${settings.light.tabs.toolbox.background.color}$3`)
  return theme
}

function _setStatusbar(settings, theme) {
  theme = theme.replace(config.regex.statusbar.background, `$1${settings.statusbar.background.color}$3`)
  theme = theme.replace(config.regex.statusbar.backgroundRaw, `$1${settings.statusbar.backgroundRaw.color}$3`)
  theme = theme.replace(config.regex.statusbar.backgroundDebug, `$1${settings.statusbar.backgroundDebug.color}$3`)
  theme = theme.replace(config.regex.statusbar.color, `$1${settings.statusbar.text.color}$3`)

  // status bar icons color

  const iconErrorURL = `"data:image/svg+xml;charset=utf-8,%3Csvg width='13' height='13' viewBox='0 0 13 13' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.5 0a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm3.9 9.1l-1.3 1.3-2.6-2.6-2.6 2.6-1.3-1.3 2.6-2.635L2.6 3.9l1.3-1.3 2.6 2.6 2.6-2.6 1.3 1.3-2.6 2.565L10.4 9.1z' fill='${settings.statusbar.text.color}' fill-rule='evenodd'/%3E%3C/svg%3E"`
  theme = theme.replace(config.regex.statusbar.iconError, `$1${iconErrorURL}$3`)

  const iconWarnURL = `"data:image/svg+xml;charset=utf-8,%3Csvg width='13' height='13' viewBox='0 0 13 13' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.15 0h-1.3L0 11.7 1.3 13h10.4l1.3-1.3L7.15 0zm0 11.7h-1.3v-1.3h1.3v1.3zm0-2.6h-1.3V3.9h1.3v5.2z' fill='${settings.statusbar.text.color}' fill-rule='evenodd'/%3E%3C/svg%3E"`
  theme = theme.replace(config.regex.statusbar.iconWarn, `$1${iconWarnURL}$3`)

  const iconGitURL = `"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M27.459 14.902L17.02 4.463a1.517 1.517 0 0 0-1.089-.452c-.417 0-.793.157-1.089.452L12.594 6.71l2.549 2.549c.249-.112.522-.177.813-.177 1.106 0 2.002.896 2.002 2.002 0 .291-.064.565-.176.814l2.311 2.336c.25-.111.633-.234.923-.234 1.106 0 2 .911 2 2.016s-.894 1.969-2 1.969C19.911 17.984 19 17.234 19 16c0-.28.016-.462.119-.704l-2.373-2.374-.023.007v6.274A2.02 2.02 0 0 1 18 21.078c0 1.105-.878 2.016-1.984 2.016a2.053 2.053 0 0 1-2.031-2.031c0-.846.535-1.564 1.28-1.857l.001-6.25a1.996 1.996 0 0 1-1.147-2.659L11.564 7.74l-7.115 7.114a1.542 1.542 0 0 0 .001 2.178L14.89 27.55c.296.295.671.45 1.089.45.415 0 .796-.159 1.089-.45l10.391-10.471a1.541 1.541 0 0 0 0-2.177z' fill='${settings.statusbar.text.color}'/%3E%3C/svg%3E"`
  theme = theme.replace(config.regex.statusbar.iconGit, `$1${iconGitURL}$3`)

  return theme
}

function _setFeedback(settings, theme) {
  theme = settings.statusbar.smiley.enabled
    ? theme.replace(config.regex.statusbar.smiley.off, config.regex.statusbar.smiley.on)
    : theme.replace(config.regex.statusbar.smiley.on, config.regex.statusbar.smiley.off)
  return theme
}
