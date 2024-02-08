import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent {
  constructor(
    private storage: StorageService,
    private router: Router
) {
}
ngOnInit(): void {
console.log('sdfgf');

}
}
