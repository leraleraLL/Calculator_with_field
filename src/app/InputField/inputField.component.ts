import { Component } from '@angular/core';
import { DataService } from "../../shared/data.service";

@Component({
  selector: 'inputField-root',
  templateUrl: './inputField.component.html',
  styleUrls: ['./inputField.component.less']
})
export class InputFieldComponent {
    valueCmd: string ='';
    constructor(private dataService: DataService){ }
 
    getValue() {
        if (!this.valueCmd){
            return
        } 
        this.dataService.setCmd(this.valueCmd)// устанавливаем команду для вывода в поле Input
        this.dataService.addCmd(this.valueCmd)// записываем значение в словарь с переменными или функциями
        this.valueCmd = ''
    }
}