import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MarkerType} from '../../shared/models/marker.model';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {Color} from '@angular-material-components/color-picker';

@Component({
  selector: 'app-add-marker-dialog',
  templateUrl: './add-marker-dialog.component.html',
  styleUrls: ['./add-marker-dialog.component.css']
})
export class AddMarkerDialogComponent {
  markerInputFormGroup: FormGroup = this.fb.group<{who: string, description: string, color: Color}>({
    who: '',
    description: '',
    color: new Color(0, 255, 255)
  });

  disabled = false;
  touchUi = false;
  color: ThemePalette

  constructor(
    public dialogRef: MatDialogRef<AddMarkerDialogComponent>,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
