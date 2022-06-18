import { Component, OnInit } from '@angular/core';
import { DataService } from "../../shared/data.service";


@Component({
  selector: 'outputField-root',
  templateUrl: './outputField.component.html',
  styleUrls: ['./outputField.component.less']
})
export class OutputFieldComponent implements OnInit{
    
    valueInput: string='';
    valueOutput: string='';
    constructor(private dataService: DataService){ }

    ngOnInit() {
        // вывод команд в блоке Input
        this.dataService._cmd.subscribe((data: string)=>{
            if (data) {
                this.valueInput += data + '\n'
            }
        });
        // вывод команд в блоке Output
        this.dataService._cmdOutput.subscribe((data: string)=>{
            if (data) {            
                this.valueOutput += data + '\n'
            }
        });
      }

    Clear(): void{       
        this.valueInput = ''
        this.valueOutput = ''
        this.dataService.vrbDict = {}
        this.dataService.fnDict = {}
    }   
}