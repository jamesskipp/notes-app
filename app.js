const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

const titleOptions = {
  describe: 'Title of note',
  demand: true,
  alias: 't'
}
const bodyOptions = {
  describe: 'Body of note',
  demand: true,
  alias: 'b'
}
const passwordOptions = {
  describe: 'A password',
  demand: true,
  alias: 'p'
}
const argv = yargs
  .command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions
  })
  .command('addEncrypted', 'Add an encypted note', {
    title: titleOptions,
    body: bodyOptions,
    password: passwordOptions
  })
  .command('list', 'List all notes')
  .command('read', 'Read a note', {
    title: titleOptions
  })
  .command('readEncrypted', 'Read an encypted note', {
    title: titleOptions,
    password: passwordOptions
  })
  .command('remove', 'Remove a note', {
    title: titleOptions
  })
  .command('removeAll', 'Remove all notes')
  .help()
  .argv;

var command = argv._[0];

if (command === 'add') {
  var note = notes.addNote(argv.title, argv.body);
  notes.logNote(note, 'Note already exists');
} else if (command === 'addEncrypted') {
  var note = notes.addEncryptedNote(argv.title, argv.body, argv.password);
  notes.logNote(note, 'Note already exists');
} else if (command === 'list') {
  var allNotes = notes.getAll();
  console.log(`Printing ${allNotes.length} note(s)`);
  allNotes.forEach((note) => notes.logNote(note, undefined));
  console.log('----------------');
} else if (command === 'read') {
  var note = notes.getNote(argv.title);
  notes.logNote(note, 'Note does not exist');
} else if (command === 'readEncrypted') {
  var note = notes.getEncryptedNote(argv.title, argv.password);
  notes.logNote(note, 'Note does not exist');
} else if (command === 'remove') {
  var noteRemoved = notes.removeNote(argv.title);
  console.log(noteRemoved ? 'Note was removed' : 'Note not found');
} else if (command === 'removeAll') {
  notes.removeAll();
} else {
  console.log('Command not recognized.');
}
