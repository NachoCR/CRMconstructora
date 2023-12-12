import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationService } from './uploadImage.service';

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

  constructor(
    private http: HttpClient,
    private communicationService: CommunicationService
  ) {}

  isFileSelected() {
    if (this.selectedFile !== null) return true;
    if (this.selectedFile == null) return false;
    return false;
  }
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

  async uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('upload_preset', this.unsignedUploadPreset);
        formData.append('file', this.selectedFile);

        this.http.post(this.uploadEndpoint, formData).subscribe({
          next: (result: any) => {
            this.communicationService.setResult(result.url);
            resolve(result.url);
          },
          error: error => {
            reject(error);
          },
          complete: () => {
            // Puedes realizar acciones adicionales si es necesario
          },
        });
      } else {
        reject('No se ha seleccionado ningún archivo.');
      }
    });
  }
}
