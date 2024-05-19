import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class BlobMediaService {
  videoChunks: Blob[] = [];
  chunkSize = 4194304; // Adjust based on maximum size of each chunks
  constructor(private httpClient: HttpClient) {}

  getBlobUrl(videoUrl: string, fileSize: number): Observable<string> {
    let totalChunks = 1;
    if (fileSize > this.chunkSize) {
      totalChunks = fileSize / this.chunkSize;
      if (fileSize % this.chunkSize > 0) totalChunks++;
    }

    return this.downloadChunksAndGetBlobUrl(videoUrl, totalChunks);
  }

  private downloadChunksAndGetBlobUrl(
    videoUrl: string,
    totalChunks: number
  ): Observable<string> {
    this.videoChunks = []; // Clear existing chunks
    const downloadPromises = [];
    for (let i = 1; i <= totalChunks; i++) {
      downloadPromises.push(this.downloadChunk(i, videoUrl));
    }

    return new Observable((observer) => {
      Promise.all(downloadPromises)
        .then((chunks) => {
          this.videoChunks = chunks;
          observer.next(this.combineChunksAndGetBlobUrl());
          observer.complete();
        })
        .catch((error) => {
          console.error('Error downloading chunks:', error);
          observer.error('Error downloading chunks:' + error);
          observer.complete();
        });
    });
  }

  private downloadChunk(chunkNumber: number, videoUrl: string): Promise<Blob> {
    const options = {
      headers: new HttpHeaders()
        .append('Accept', 'video/mp4')
        .append('CHUNK', chunkNumber.toString())
        .append('CHUNK-SIZE', this.chunkSize.toString()),
      responseType: 'blob' as 'json', // Ensure responseType is set to blob
    };
    // return this.httpClient.get(videoUrl, options).toPromise() as Promise<Blob>;
    return firstValueFrom(this.httpClient.get<Blob>(videoUrl, options));
  }

  private combineChunksAndGetBlobUrl(): string {
    const combinedBlob = new Blob(this.videoChunks);
    return window.URL.createObjectURL(combinedBlob);
  }
}
