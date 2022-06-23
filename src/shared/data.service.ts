import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
 
    private _cmdSource = new BehaviorSubject<string>('');
    _cmd = this._cmdSource.asObservable();
    private _cmdSourceOutput = new BehaviorSubject<string>('');
    _cmdOutput = this._cmdSourceOutput.asObservable();
    public vrbDict: { [key: string]: any; } = {}; // словарь переменных
    public fnDict: { [key: string]: any; } = {}; // словарь функций

    setCmd(_cmd: string): void {
        return this._cmdSource.next(_cmd);
      }

    addCmd(value: string) {
      let re = /[ ,=]+/
      let arrValues = value.split(re)
      let nameCmd = arrValues[0]
      let nameIdentific = arrValues[1]
      let valueIdentific = arrValues[2]

      switch( nameCmd ) {

        case 'var':
          if (this.checkNameVariable(arrValues, nameIdentific)){
            if (nameIdentific in this.vrbDict) { // если имя переменной есть в словаре, то игнорируется
              this.OutputDisplay('переменная уже определена')
            } else {
              this.vrbDict[nameIdentific] = 'nan'
            }  
          }
          break;
        
        case 'let':
          if (this.checkNameVariable(arrValues, nameIdentific)){
            if (valueIdentific) {
              if (!isNaN(valueIdentific as any)) { // если значение это число
                valueIdentific = parseFloat(valueIdentific).toFixed(2)
                this.vrbDict[nameIdentific] = this.checkVariblFn(valueIdentific)
              } else if (valueIdentific in this.fnDict) { // если переменной присвоили функцию
                this.vrbDict[nameIdentific] = this.checkFuncFn(valueIdentific) 
              } else {
                this.vrbDict[nameIdentific] = this.checkVariblFn(valueIdentific)
              }
            }
          }
          break;

        case 'fn':
          if (this.checkNameVariable(arrValues, nameIdentific) ){
            if (valueIdentific) {
              this.fnDict[nameIdentific] = valueIdentific
            } else {
            this.fnDict[nameIdentific] = 'nan'
            }
          }
          break;

        case 'print':
          let mess: string = ''
          if (nameIdentific in this.vrbDict) { // вывод значение переменной или функции
            mess = this.checkVariblFn(this.vrbDict[nameIdentific])
          } else {
            mess = this.checkFuncFn(this.fnDict[nameIdentific])
          } 

          this.OutputDisplay(mess)
          break;

        case 'printvars':
          if (Object.keys(this.vrbDict).length !== 0) { // если словарь не пуст
            Object.keys(this.vrbDict).sort().forEach(key => {
              let value = this.vrbDict[key]
              if (!isNaN(value)) { 
                value = parseFloat(this.vrbDict[key]).toFixed(2)
              }
              this.OutputDisplay(key + ':' + value) ;
            });
          }
          break;

        case 'printfns':
          if (Object.keys(this.fnDict).length !== 0) { // если словарь не пуст
            Object.keys(this.fnDict).sort().forEach(key => {
              let value = this.checkFuncFn(key)
              if (!isNaN(value)) { 
                value = parseFloat(value).toFixed(2)
              }
              this.OutputDisplay(key + ' : ' + value) ;
            });
          }
          break;
      }
    }

    // вывод на output display
    OutputDisplay(mess: any): any {
      if (!isNaN(mess)) { // если число
        mess = parseFloat(mess).toFixed(2)
      }
      this._cmdSourceOutput.next(mess);
    }

    // проверка наименования переменной
    checkNameVariable(arr: Array<string>, name: string): boolean {
      if (arr.length !== 1  // является ли строка пустой
          && (isNaN(name[0] as any) // является ли первое значение числом
          && (/^[a-zA-Z0-9_]+$/.test(name)) 
          ) ) {
        return true
      } else {
        return false
      }
    }

    // recursive function variable
    checkVariblFn(val: any): any {
      if (!isNaN(val)) { // если число, то вернуть его
        return +val
      } else {
        if (val in this.vrbDict) { // если есть в словаре, снова вызвать функцию
          return this.checkVariblFn(this.vrbDict[val])
        } else {
          return 'nan'
        }
      }
    }

    // recursive function func
    checkFuncFn(valF: any): any {
      let arrValue = valF.split( /[+,\-,\*,/]/)
      let re = ['+','-','*','/']
      if (arrValue.length == 1) { // если функция равна одному значению
        if (valF in this.vrbDict) {
          return this.checkVariblFn(valF)
        } else if (valF in this.fnDict){
          return this.checkFuncFn(this.fnDict[valF])
        } else {
          return 'nan'
        }
      } else {  // если функция состоит из операции
        let firstVal = arrValue[0]
        let secondVal = arrValue[1]
        let op 
        for (let operat of re) {
          if (valF.includes(operat)) {
            op = operat;
            break;
          }
        }
        switch( op ) {
          case '+':
            let res1 = this.checkFuncFn(firstVal) + this.checkFuncFn(secondVal);
            if (isNaN(res1)){ // если не число
              return 'nan'
            } else {
              return res1
            }
          case '-':
            let res2: any = this.checkFuncFn(firstVal) - this.checkFuncFn(secondVal);
            if (isNaN(res2)){ // если не число
              return 'nan'
            } else {
              return res2
            }
          case '*':
            let res3: any = this.checkFuncFn(firstVal) * this.checkFuncFn(secondVal);
            if (isNaN(res3)){ // если не число
              return 'nan'
            } else {
              return res3
            }
          case '/':
            let res4: any = this.checkFuncFn(firstVal) / this.checkFuncFn(secondVal);
            if (isNaN(res4)){ // если не число
              return 'nan'
            } else {
              return res4
            }
        }
      }
    }

}
