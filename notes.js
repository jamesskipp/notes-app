const fs = require('fs');
const crypto = require('crypto');

var fetchNotes = () => {
  try {
    return JSON.parse(fs.readFileSync('notes-data.json'));
  } catch (err) {
    return [];
  }
};

var saveNotes = (notes) => {
  fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};

var addNote = (title, body) => {
  var notes = fetchNotes();
  var note = {
    title,
    body
  };

  var duplicateNotes = notes.filter((note) => note.title === title);

  if (duplicateNotes.length === 0) {
    notes.push(note);
    saveNotes(notes);
    return note;
  }
};

var addEncryptedNote = (title, body, password) => {
  var cipher = crypto.createCipher('aes192', password);
  title  = cipher.update(title, 'utf8', 'hex');
  title += cipher.final('hex');
  cipher = crypto.createCipher('aes192', password);
  body = cipher.update(body, 'utf8', 'hex');
  body += cipher.final('hex');
  return addNote(title, body);
}

var getAll = () => {
  return fetchNotes();
}

var getNote = (title) => {
  var notes = fetchNotes();
  return notes.filter((note) => note.title === title)[0];
}

var getEncryptedNote = (title, password) => {
  var notes = fetchNotes();

  const cipher = crypto.createCipher('aes192', password);
  let encryptedTitle = cipher.update(title, 'utf8', 'hex');
  encryptedTitle += cipher.final('hex');
  var note = getNote(encryptedTitle);
  if (note) {
    note.title = title;
    const decipher = crypto.createDecipher('aes192', password);
    note.body = decipher.update(note.body, 'hex', 'utf8');
    note.body += decipher.final('utf8');
  }

  return note;
}

var removeNote = (title) => {
  var notes = fetchNotes();
  var filteredNotes = notes.filter((note) => note.title !== title);
  saveNotes(filteredNotes);

  return notes.length !== filteredNotes.length;
}

var removeAll = () => {
  saveNotes(undefined);
}

var logNote = (note, message) => {
  if (note) {
    console.log(`----------------\nTitle: ${note.title}\n${note.body}`);
  } else if (message) {
    console.log(message);
  }
}

module.exports = {
  addNote,
  addEncryptedNote,
  getAll,
  getNote,
  getEncryptedNote,
  removeNote,
  removeAll,
  logNote
}
