import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  fileName?: string;
  imageSrc?: string;
  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.imageSrc = URL.createObjectURL(file);
      console.log(this.imageSrc);
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('thumbnail', file);

      // const upload$ = this.http.post('/api/thumbnail-upload', formData);

      // upload$.subscribe();
    }
  }
}
