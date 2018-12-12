class CalcController {

    constructor(){

        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        //selecionando elementos HTML por meio de seletores CSS3
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        //Display da calculadora - underline significa que o atributo é privado
        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    copyToClipboard(){

        

    }

    /**
     * Função de inicialização
     * esta função sera executada assim que a aplicação for iniciada
     */
    initialize(){

        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000); //Intervalo de tempo do refresh

        this.setLastNumberToDisplay();

    }

    /**
     * Função para pegar a data e o tempo atuais
     */
    setDisplayDateTime(){

        //Pegando a data e hora atuais
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }); 
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    /**
     * Metodo para pegar os eventos do teclado
     */
    initKeyboard(){

        document.addEventListener('keyup', e => {

            console.log(e.key);

            switch (e.key) {

                case 'Escape':
                
                    this.clearAll();
    
                    break;
    
                case 'Backspace':
    
                    this.clearEnter();
    
                    break;
    
                case '+':
                    this.addOperation(e.key);
                    break;
    
                case '-':
                    this.addOperation(e.key);
                    break;
    
                case '*':
                    this.addOperation(e.key);
                    break;
    
                case '/':
                    this.addOperation(e.key);
                    break;
    
                case '%':
                    this.addOperation(e.key);
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                
                case '.':
                case ',':
                    this.addDot('.');
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':             
                case '8': 
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'End':
                    this.addOperation('1');
                    break;

                case 'ArrowDown':
                    this.addOperation('2');
                    break;

                case 'PageDown':
                    this.addOperation('3');
                    break;

                case 'ArrowLeft':
                    this.addOperation('4');
                    break;

                case 'Clear':
                    this.addOperation('5');
                    break;

                case 'ArrowRight':
                    this.addOperation('6');
                    break;

                case 'Home':
                    this.addOperation('7');
                    break;

                case 'ArrowUp':
                    this.addOperation('8');
                    break;

                case 'PageUp':
                    this.addOperation('9');
                    break;

            }

        })

    }

    /**
     * Função para criar um evento addEventListenerAll
     * Onde posso pegar mais um evento e converter em Array
     */
    addEventListenerAll(element, events, fn){

        //split - transforma uma string em um array
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    /**
     * Metodo para apagar todo display
     */
    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    /**
     * Metodo para apagar o ultimo caracter
     * pop - exclui o ultimo item adicionado no array
     */
    clearEnter(){

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    /**
     * Metodo para retorna a ultima operação digitada
     */
    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    /**
     * Metodo para alterar o ultimo valor digitado
     */
    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    /**
     * Metodo para verificar se o ultimo digito é um operador ou não
     * indexOf - busca o valor recebido como parametro dentro do array e retorna o index do elemento achado
     * caso não seja encontrado indexOf retorna -1(false)
     */
    isOperator(value){

        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);

    }

    /**
     * Metodo para fazer os calculos em pares 
     */
    pushOperation(value){

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult(){



        return eval(this._operation.join(''));

    }

    /**
     * Metodo para calcular a operação
     * Eval - interpreta e calcula uma String
     */
    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3){

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%') {

            //result = result / 100;
            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    /**
     * Metodo para pegar o ultimo item digitado
     */
    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i];
                break;

            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    /**
     * Metodo para atualizar o display com o ultimo numero
     * for - percorre todo array de trás pra frente, até achar o primeiro numero
     */
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    /**
     * Metodo para adcionar uma operação
     * push - adcionar um item no array
     * Estrutura de condição para verificar se o ultimo digito da operação é um numero ou um sinal
     */
    addOperation(value){

        //console.log('A', value, isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())){

            if (this.isOperator(value)){

                //Trocar o operador
                this.setLastOperation(value);

            } else {
                
                //Adicionando o primeiro valor digitado
                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {
                
                this.pushOperation(value);

            } else {

                let newValue;

                //Caso o ultimo digito seja um numero ele vai ser concatenado com o valor digitado e não somado
                if (this.getLastOperation().toString() !== '0') {
                    newValue = this.getLastOperation().toString() + value.toString();
                } else {
                    newValue = value.toString();
                }

                this.setLastOperation(newValue);

                //Atualizar display
                this.setLastNumberToDisplay();

            }

        }

    }

    setError(){

        this.displayCalc = 'Error';

    }

    /**
     * 
     * split - para dividir em arrays
     */
    addDot(){
        
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        }else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        //Atualizando o display
        this.setLastNumberToDisplay();
        //console.log(lastOperation);

    }

    execBtn(value){

        switch (value) {

            case 'ac':
            
                this.clearAll();

                break;

            case 'ce':

                this.clearEnter();

                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;
            
            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':             
            case '8': 
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    }

    /**
     * Função para pegar todos os elementos <g> dos pais #buttons e #parts
     * Adicionando eventos para cada elemento
     */
    initButtonsEvents(){

        //O sinal de > (maior que) significa filho
        let buttons = document.querySelectorAll('#buttons > g, #parts > g'); 

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {

                //replace - substitui o texto do elemento por outro valor
                let textBtn = btn.className.baseVal.replace('btn-', '');

                //metodo para executar o botao selecionado
                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                //mudando o stilo do mouse
                btn.style.cursor = 'pointer'; 

            })

        })

    }

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){
        this._currentDate = value;
    }

}