'use strict'

const Evernote = require('evernote')
const enAuth = require('./en-auth')

exports.notebooks = (token) => {
  const client = enAuth.createAuthenticatedClient(token)
  return client.getNoteStore().listNotebooks()
}

exports.notesMetadata = token => {
  const client = enAuth.createAuthenticatedClient(token)
  const noteStore = client.getNoteStore()

  const filter = new Evernote.NoteStore.NoteFilter()
  filter.notebookGuid = 'efa61084-ee95-4e47-a8d0-be81a4b1c658'

  const noteCount = noteStore.findNoteCounts(token, filter)
  .then(count => count['notebookCounts'][filter.notebookGuid])
  .catch(err => err)

  const maxNotes = 50
  const offset = noteCount < maxNotes ? 0 : getRandomInt(0, noteCount-maxNotes)

  var spec = new Evernote.NoteStore.NotesMetadataResultSpec()
  for (var p in spec) { if (p.indexOf('include') !== -1) { spec[p] = true } }

  const noteGuids = noteStore.findNotesMetadata(filter, offset, maxNotes, spec)
  //.then(notesMetadata => notesMetadata)
  .then(notesMetadata => notesMetadata.notes.map(n => n.guid))
  .catch(err => [])

  //return spec

  //return noteGuids
  //for (var p in spec) { if (p.indexOf('include') !== -1) { spec[p] = true } }

  return noteStore.getNote("6cb3439c-8f85-45a2-8be6-cad30e55375a", true, true, true, true)
  .then(note => note.content).catch(err => err)

  return noteStore.getNoteWithResultSpec("6cb3439c-8f85-45a2-8be6-cad30e55375a", spec)
  .then(note => note).catch(err => err)
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}