import { NegociacaoController } from "./controllers/NegociacaoController";
import {} from "./polyfill/fetch";

let negociacaoController = new NegociacaoController();
let $ = document.querySelector.bind(document);

$(".form").onsubmit = negociacaoController.adiciona.bind(negociacaoController);

$("[type=button]").onclick = negociacaoController.apaga.bind(
  negociacaoController
);
