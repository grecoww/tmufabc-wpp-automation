# tmufabc-wpp-automation
Automação de whatsapp para cobrar as pessoas que não pagaram a mensalidade do tênis de mesa em dia

Funcionamento:

No vencimento de todo mês (dia 15), o usuário executará esse script localmente.
O script entrará na planilha do mês atual no drive do tênis de mesa, obterá todos os usuários com status "não pago"
Cruzará os dados com o formulário de dados dos atletas, assim obtento o número de cada um
Chamará cada inadimplente pelo whatsapp cobrando o cliente de pagar a mensalidade

(Por conta do sistema não possuir servidor, será impossível fazer monitoramentos mais complexos, como confirmar o pagamento da mensalidade. Entretanto, quem sabe mais pra frente da pra fazer algo do tipo)

