const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');
const multer = require('multer');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

router.get('/', pizzaController.getAllPizzas);
router.post('/', upload.single('imagem'), pizzaController.addPizza);
router.post('/edit/:idPizza', upload.single('imagem'), pizzaController.editPizza);
router.delete('/:idPizza', pizzaController.deletePizza);

module.exports = router;
