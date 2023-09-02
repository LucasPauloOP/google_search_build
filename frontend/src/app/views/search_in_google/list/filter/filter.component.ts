import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() form!: FormGroup;
  @Output() sendRequest: EventEmitter<any> = new EventEmitter();

  doSearch() {
    this.form.get('start')?.setValue(0);
    this.sendRequest.emit()
  }
}
