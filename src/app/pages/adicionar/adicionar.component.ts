import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Jogador} from "../../shared/models/jogador";
import {StorageService} from "../../shared/services/storage.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-adicionar',
    templateUrl: './adicionar.component.html',
    styleUrls: ['./adicionar.component.scss']
})
export class AdicionarComponent implements OnInit {

    @ViewChild('inputNome') inputNome: any;
    form: FormGroup;
    numero: number;
    showModal = false;

    constructor(
        private fb: FormBuilder,
        private storage: StorageService,
        private router: Router
    ) {
        this.form = this.fb.group({
            nome: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
    }

    submit() {
        if (this.form.valid) {
            const jogador = new Jogador(this.form.get('nome').value);
            this.storage.adicionarJogador(jogador);
            this.form.reset();
            this.inputNome.nativeElement.focus();
            this.router.navigate(['/listar']).catch();
        }
    }

    incluirNumeroJogadores(numero: number){
        this.storage.incluirNumeroJogadores(numero);
        this.showModal = false;
        this.router.navigate(['/listar']).catch();
    }
}
