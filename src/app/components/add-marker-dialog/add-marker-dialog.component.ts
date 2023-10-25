import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MarkerType} from '../../shared/models/marker.model';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-marker-dialog',
  templateUrl: './add-marker-dialog.component.html',
  styleUrls: ['./add-marker-dialog.component.css']
})
export class AddMarkerDialogComponent {
  markerInputFormGroup: FormGroup = this.fb.group<{user: string, description: string, type: MarkerType}>({
    user: '',
    description: '',
    type: MarkerType.VACATION
  });

  constructor(
    public dialogRef: MatDialogRef<AddMarkerDialogComponent>,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
