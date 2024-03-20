const fs = require('fs');

//membuat folder data
const dirpath = './data';
if (!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath);
};

//membuat file contact json jika belum ada
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
};

//memuat Contact
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);
    return contacts;
}

//cari contact berdasarkan nama di data contact.json 
const findContact = (Nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.Nama.toLowerCase() === Nama.toLowerCase());
return contact;
}

//menimopa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json' , JSON.stringify(contacts))
}


//Menambahkan contact baru 
const addContact = (contact) => {
    const  contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

//cek duplikat nama
const cekDuplikat = (Nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.Nama === Nama)
}

//Menghapus Data
const deleteContact = (Nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.Nama !== Nama);
    saveContacts(filteredContacts);
}

const updateContacts = (contactBaru) => {
    const contacts = loadContact();
    //hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContacts = contacts.filter((contact) => contact.Nama !== contactBaru.oldNama);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}

module.exports = {
    loadContact,
    findContact,
    addContact,
    cekDuplikat,
    deleteContact,
    updateContacts,
}