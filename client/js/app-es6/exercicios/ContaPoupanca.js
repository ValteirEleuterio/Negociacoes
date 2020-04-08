class ContaPoupanca extends Conta {

    atualiza(taxa){

        this._saldo += 2 * taxa;
    }
}