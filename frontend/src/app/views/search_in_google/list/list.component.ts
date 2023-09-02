import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SearchInGoogleService } from 'src/app/services/search-in-google.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent  {
  public dataSource:any = [];
  public form: FormGroup;
  pageSize = 10;
  pageIndex = 0;
  pageEvent: PageEvent = new PageEvent;

  constructor(
    private searchServices: SearchInGoogleService,
    private toastService: ToastrService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      search: ['', Validators.required],
      start:  [0]
    })
  }

   async doSearch(incrementStart: Boolean = false) {
      try {
        const filters = this.form.getRawValue()
        if (incrementStart) filters.start += 10;
        else this.dataSource = [];

        const newData = await this.searchServices.getGoogleResults(filters);

        newData.map((teste: any) => this.dataSource.push(teste));

      } catch (err) {
        console.log(err);

        this.toastService.error('Erro ao realizar a pesquisa');
      }
   }

   redirect(url: string) {
     window.open(url, '_blank')
   }
}
