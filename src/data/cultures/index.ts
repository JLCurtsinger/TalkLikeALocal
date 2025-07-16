import { akChin } from './akChin';
import { apache } from './apache';
import { arapaho } from './arapaho';
import { blackfoot } from './blackfoot';
import { carrier } from './carrier';
import { cherokee } from './cherokee';
import { choctaw } from './choctaw';
import { cocopah } from './cocopah';
import { cree } from './cree';
import { dene } from './dene';
import { fortMojave } from './fortMojave';
import { gilaRiver } from './gilaRiver';
import { havasupai } from './havasupai';
import { hawaiian } from './hawaiian';
import { hopi } from './hopi';
import { hualapai } from './hualapai';
import { klamath } from './klamath';
import { lakota } from './lakota';
import { navajo } from './navajo';
import { ojibwe } from './ojibwe';
import { paiute } from './paiute';
import { pascuaYaqui } from './pascuaYaqui';
import { pimaMaricopa } from './pimaMaricopa';
import { seneca } from './seneca';
import { spokane } from './spokane';
import { quechan } from './quechan';
import { tohonoOodham } from './tohonoOodham';
import { yavapai } from './yavapai';
import { yupik } from './yupik';

// Add website URLs to each culture
akChin.websiteUrl = 'https://www.ak-chin.nsn.us/';
apache.websiteUrl = 'https://www.scat-nsn.gov/';
arapaho.websiteUrl = 'https://www.northernarapaho.com/';
blackfoot.websiteUrl = 'https://blackfeetnation.com/';
carrier.websiteUrl = 'https://www.carriersekani.ca/';
cherokee.websiteUrl = 'https://www.cherokee.org/';
choctaw.websiteUrl = 'https://www.choctawnation.com/';
cocopah.websiteUrl = 'https://www.cocopah.com/';
cree.websiteUrl = 'https://www.creehealth.org/';
dene.websiteUrl = 'https://denenation.com/';
fortMojave.websiteUrl = 'https://www.fortmojaveindiantribe.com/';
gilaRiver.websiteUrl = 'https://www.mygilariver.com/';
havasupai.websiteUrl = 'https://www.theofficialhavasupaitribe.com/';
hawaiian.websiteUrl = 'https://www.nationofhawaii.org/';
hopi.websiteUrl = 'https://www.hopi-nsn.gov/';
hualapai.websiteUrl = 'https://hualapai-nsn.gov/';
klamath.websiteUrl = 'https://klamathtribes.org/';
lakota.websiteUrl = 'https://lakotadakotanakotanation.org/';
navajo.websiteUrl = 'https://www.navajo-nsn.gov/';
ojibwe.websiteUrl = 'https://www.mnchippewatribe.org/';
paiute.websiteUrl = 'https://www.utahpaiutes.org/';
pascuaYaqui.websiteUrl = 'https://www.pascuayaqui-nsn.gov/';
pimaMaricopa.websiteUrl = 'https://www.srpmic-nsn.gov/';
seneca.websiteUrl = 'https://sni.org/';
spokane.websiteUrl = 'https://www.spokanetribe.com/';
quechan.websiteUrl = 'https://www.quechantribe.com/';
tohonoOodham.websiteUrl = 'https://www.tonation-nsn.gov/';
yavapai.websiteUrl = 'https://www.yavapai-apache.org/';
yupik.websiteUrl = 'https://akiaknativecommunity.org/';

// Export all cultures in alphabetical order
export const cultures = [
  akChin,
  apache,
  arapaho,
  blackfoot,
  carrier,
  cherokee,
  choctaw,
  cocopah,
  cree,
  dene,
  fortMojave,
  gilaRiver,
  havasupai,
  hawaiian,
  hopi,
  hualapai,
  klamath,
  lakota,
  navajo,
  ojibwe,
  paiute,
  pascuaYaqui,
  pimaMaricopa,
  seneca,
  spokane,
  quechan,
  tohonoOodham,
  yavapai,
  yupik
].sort((a, b) => a.name.localeCompare(b.name));