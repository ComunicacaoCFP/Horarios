import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-filtro-prof',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-prof.component.html',
  styleUrl: './filtro-prof.component.css'
})
export class FiltroProfComponent {
  horarios: any[] = [];
  professores: any[] = [];
  cores: any[] = [];
  matriz: any[] = [];  
  atual: any[] = [];
  selected = {
    professor: ''
  }
  async ngOnInit(){
    var a = "";
    var b = "";
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < 29; j++){
        if(j < 4){a = "0";}
        else{ a = "";}
        if(j % 2 == 0){b = "0";}
        else{ b = "";}
        this.matriz.push({"cor":"#f5f5dc", "codigo":" ", "horario": a + (8 + Math.floor(j/2)) + ":" + (30 * (j % 2)) + b});
      }
    }  
    let workbook = await this.readFile();
    workbook.SheetNames.forEach(wkb => {
      const worksheet = workbook.Sheets[wkb];
      const raw_data = XLSX.utils.sheet_to_json(worksheet, {header: 1, skipHidden: true, blankrows: false});
      let horario = {
        semestre : "",
        codigo : "",
        componenteCurricular : "",
        docente : "",
        dia : "",
        hora : "",
        local : "",
        curso : "",
        periodo : ""
      };
      raw_data.slice(6).forEach((r:any) => {      
        horario.semestre = r[0] == null ? horario.semestre : r[0];
        let teste = true;
        if(horario.semestre){
          for(let i = 1; i <11; i++){
            if(horario.semestre.includes(i.toString())){
              teste = false;
              break;
            }            
          }    
        }  
        if(teste){
          horario.semestre = "outro";
        } 
        horario.codigo = r[3];
        horario.componenteCurricular = r[4];
        horario.docente = r[7];
        horario.curso = wkb;
        if(wkb.toLowerCase() == "educação do campo"){
          horario.periodo = r[8];
          horario.dia = r[9];
          horario.hora = r[10];
          horario.local = r[11];
        }
        else{
          horario.dia = r[8];
          horario.hora = r[9];
          horario.local = r[10];
        }
        
        if(horario.docente != null && horario.dia != null && horario.hora != null) {
          horario.docente = horario.docente.trim().toUpperCase();
          let cc = Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
          let hex = cc;
          let r = parseInt(hex.substr(0, 2), 16);
          let g = parseInt(hex.substr(2, 2), 16);
          let b = parseInt(hex.substr(4, 2), 16);
          let lum = (r + g + b)/3;
          let l = "#fff";
          if(lum > 128){l = "#000";}
          let c = {
            "codigo": horario.codigo,
            "cor": ('#' + cc),
            "letra": l
          };
          if(this.cores.find(cor => cor == c) == null){
            this.cores.push(JSON.parse(JSON.stringify(c)));
          }
          if(this.professores.find(p => p == horario.docente) == null){
            this.professores.push(horario.docente);
          }
          this.horarios.push(JSON.parse(JSON.stringify(horario)));
        }
      });
    });   
    this.professores.sort();
  }
  async readFile() {
    const url = "./planejamento.xlsx";
    const file = await (await fetch(url)).arrayBuffer();
    const workbook = XLSX.read(file);
    return workbook;
  }
  onChangeObj(){
    var div = document.getElementsByName("interna");
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < 29; j++){
        this.matriz[i*29 + j].cor = "#f5f5dc";
        this.matriz[i*29 + j].codigo = " "; 
        this.matriz[i*29 + j].letra = "#000"; 
      }
    }
    this.atual = [];
    const semana = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    this.horarios.forEach((element) => {      
      for(var i = 0; i < 6; i++){
        let dias = element.dia.split(" / ");
        let hr = element.hora.split(" / ");
        let periodo = element.periodo.split(" a ");
        let count = 0;
        dias.forEach((day : String) => {    
          if(semana.indexOf(day.trim().toLowerCase()) == i && element.docente.toLowerCase() == this.selected.professor.toLowerCase()){
            var dt1 = new Date(); 
            var dt2 = new Date();
            var dtI = new Date();  
            var dtF = new Date(); 
            if(periodo != ""){
              dtI.setDate(parseInt(periodo[0].split("/")[0]));
              dtI.setMonth(parseInt(periodo[0].split("/")[1]) - 1);
              dtF.setDate(parseInt(periodo[1].split("/")[0]));
              dtF.setMonth(parseInt(periodo[1].split("/")[1]) - 1);
            } 
            dtI.setHours(parseInt(hr[count].split(" às ")[0].split(":")[0])); 
            dtI.setMinutes(parseInt(hr[count].split(" às ")[0].split(":")[1]));
            dtI.setMilliseconds(0);
            dtF.setHours(parseInt(hr[count].split(" às ")[1].split(":")[0])); 
            dtF.setMinutes(parseInt(hr[count].split(" às ")[1].split(":")[1]));
            dtF.setMilliseconds(0);        
            for(var j = 0; j < 29; j++){
              dt1.setHours(8 + Math.floor(j/2), 30 * (j % 2), 0, 0);              
              dt2.setHours(8 + Math.floor((j+1)/2), 30 * ((j+1) % 2), 0, 0);    
              if((dtI.toLocaleTimeString() >= dt1.toLocaleTimeString() && dtI.toLocaleTimeString() < dt2.toLocaleTimeString()) || (dtI.toLocaleTimeString() < dt1.toLocaleTimeString() && dtF.toLocaleTimeString() > dt2.toLocaleTimeString())|| (dtI.toLocaleTimeString() < dt1.toLocaleTimeString() && dtF.toLocaleTimeString() == dt2.toLocaleTimeString())){           
                var c = this.cores.find(c => c.codigo == element.codigo);
                this.matriz[(29*i) + j].codigo = c.codigo;
                this.matriz[(29*i) + j].cor = c.cor;   
                this.matriz[(29*i) + j].letra = c.letra; 
                div[(i*29) + j].style.backgroundColor = this.matriz[(i*29) + j].cor;
                div[(i*29) + j].style.color = this.matriz[(i*29) + j].letra;
                if(!this.atual.find(cd => cd.codigo == element.codigo)){
                  let val = {"codigo": element.codigo, "componente" : element.componenteCurricular, "cor": c.cor, "letra": c.letra}
                    this.atual.push(JSON.parse(JSON.stringify(val)));
                }
              }
            }
          } 
          count++;  
        });                
      }
    });
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < 29; j++){
        div[(i*29) + j + 29].style.backgroundColor = this.matriz[(i*29) + j].cor; 
        div[(i*29) + j + 29].style.color = this.matriz[(i*29) + j].letra;  
        
      }
    }
  }
}
