import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  @Input() imageSrc: any;
  cloudName: string = 'dvti3rnyq';
  unsignedUploadPreset: string = 'ezqicsjs';
  uploadEndpoint: string = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  apiKey = '562183172196363';
  apiSecret = 'uWwD2flyFgdGJdoVmfUBew7WGjM';

  @Output() imagePostedURLEvent = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileUpload(): any {
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', this.unsignedUploadPreset);

      this.http.post(this.uploadEndpoint, formData).subscribe({
        next: (result: any) => {
          this.imagePostedURLEvent?.emit(result.url ?? '');
        },
        error: error => {},
        complete: () => {
          // // console.log('Request completed');
        },
      });
    }
  }
}
