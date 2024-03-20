const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts');
const {loadContact , findContact, addContact, cekDuplikat, deleteContact, updateContacts} = require('./utils/contacts.js') 
const {body , validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


//konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));
app.use(flash());

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
//gunakan ejs
app.set('view engine', 'ejs');
//third-party middleware 
app.use(expressLayouts)


    app.get('/', (req, res) => {
        // res.sendFile('./index.html', {
        //     root: __dirname
        // })
        const mahasiswa = [
            {
                nama: "ラヴィ アズラ プトラ",
                email: "ravi@gmail.com",
            },
            {
                nama: "Okkotsu Yuta",
                email: "Yuta@gmail.com",
            },
            {
                nama: "shinobu Kochou",
                email: "Shinobu@gmail.com",
            }
        ];
        res.render('index', {
            nama: "ラヴィ アズラ プトラ",
            title: "Halaman Home",
            mahasiswa: mahasiswa,
            layout: "layouts/layout"
        })
    });

//rute ke halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        layout: "layouts/layout.ejs",
        title: "Halaman About",
    })
});

//rute ke halaman contact
app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact', {
        title: "Halaman Contact",
        layout: "layouts/layout.ejs",
        contacts: contacts,
        msg: req.flash('msg'),
    })
});

//halamaan form tambah data contact
app.get('/contact/add', (req , res) => {
    res.render('add_contact' , {
        title: 'Form Tambah Data Contact',
        layout: "layouts/layout.ejs",
    })
});

//rute proses data contact
app.post('/contact', 
[
    body('Nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        if (duplikat){
            throw new Error('Nama Contact Sudah Terdaftar!!')
        }
        return true;
    }),
    check('email', 'Email Tidak Valid Woy!!').isEmail(),
    check('NoTelepon', 'No Telepon Tidak Valid Woy!!').isMobilePhone('id-ID'),
    
] ,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()})
        res.render('add_contact', {
            title: "form tambah data contact",
            layout: "layouts/layout.ejs",
            errors: errors.array(),
        })
    }else{
    addContact(req.body);
    //kirimkan flash
    req.flash('msg', 'Data Contact Berhasil di tambahkan !!')
    res.redirect('/contact');
    }
    
});

//Menghapus Data
app.get('/contact/delete/:Nama', (req, res) => {
    const contact = findContact(req.params.Nama);

    //Jika Contact tidak ada
    if (!contact){
        res.status(404);
        res.send("<h1>404</h1>")
    }else{
        deleteContact(req.params.Nama);
        //kirimkan flash
        req.flash('msg', 'Data Contact Berhasil di hapus !!')
        res.redirect('/contact');
    }
});

//Mengubah Data
app.get('/contact/edit/:Nama', (req , res) => {
    const contact = findContact(req.params.Nama);
    res.render('edit_contact' , {
        title: 'Form Ubah Data Contact',
        layout: "layouts/layout.ejs",
        contact: contact,
    })
});

//Proses Ubah data
app.post('/contact/update', 
[
    body('Nama').custom((value, {req}) => {
        const duplikat = cekDuplikat(value);
        if (value !== req.body.oldNama && duplikat){
            throw new Error('Nama Contact Sudah Terdaftar!!')
        }
        return true;
    }),
    check('email', 'Email Tidak Valid Woy!!').isEmail(),
    check('NoTelepon', 'No Telepon Tidak Valid Woy!!').isMobilePhone('id-ID'),
    
] ,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()})
        res.render('edit_contact', {
            title: "form ubah data contact",
            layout: "layouts/layout.ejs",
            errors: errors.array(),
            contact: req.body
        })
    }else{
    updateContacts(req.body);
    //kirimkan flash
    req.flash('msg', 'Data Contact Berhasil di ubah !!')
    res.redirect('/contact');
    }
    
});

//halaman detail contact
app.get('/contact/:Nama', (req, res) => {
    const contact = findContact(req.params.Nama);
    res.render('detail', {
        title: "Detail Contact",
        layout: "layouts/layout.ejs",
        contact: contact,
    })
});


app.use((req, res) => {
    res.status(404);
    res.send("NOT FOUND 404")
})

app.listen(port, () => {
    console.log(`Berjalan di port ${port}`);
});

























































