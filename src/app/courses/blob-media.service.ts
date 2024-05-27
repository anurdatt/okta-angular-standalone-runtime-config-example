import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  concat,
  delay,
  firstValueFrom,
  of,
  from,
  forkJoin,
} from 'rxjs';

import { concatMap } from 'rxjs/operators';

@Injectable()
export class BlobMediaService {
  videoChunks: Blob[] = [];
  chunkSize = 4194304; // Adjust based on maximum size of each chunks
  MAX_CONCURRENT_PROCESS = 10;
  constructor(private httpClient: HttpClient) {}

  // getBlobUrl2(videoUrl: string, fileSize: number): Observable<string> {
  //   let totalChunks = 1;
  //   if (fileSize > this.chunkSize) {
  //     totalChunks = Math.floor(fileSize / this.chunkSize);
  //     if (fileSize % this.chunkSize > 0) totalChunks++;
  //   }

  //   this.videoChunks = []; // Clear existing chunks

  //   // return this.downloadChunksAndGetBlobUrl(videoUrl, totalChunks);

  //   let blobsObservables: Observable<Blob[]>[] = [];
  //   let i = 0;
  //   console.log('Inside BlobMediaService - 1 - totalChunks = ' + totalChunks);
  //   console.log(
  //     'Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS) = ' +
  //       Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS)
  //   );
  //   for (; i < Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS); i++) {
  //     console.log('Inside BlobMediaService - 2 - i = ' + i);
  //     blobsObservables.push(
  //       this.downloadChunksAndGetBlobArray(
  //         videoUrl,
  //         this.MAX_CONCURRENT_PROCESS,
  //         i * this.MAX_CONCURRENT_PROCESS + 1
  //       ).pipe(
  //         catchError((err) => {
  //           console.error(
  //             `Error downloading chunks for startChunk ${
  //               i * this.MAX_CONCURRENT_PROCESS + 1
  //             } - ${err}`
  //           );
  //           return of(null);
  //         })
  //       )
  //     );
  //   }
  //   console.log('Inside BlobMediaService - 3 - i = ' + i);
  //   blobsObservables.push(
  //     this.downloadChunksAndGetBlobArray(
  //       videoUrl,
  //       totalChunks % this.MAX_CONCURRENT_PROCESS,
  //       i * this.MAX_CONCURRENT_PROCESS + 1
  //     ).pipe(
  //       catchError((err) => {
  //         console.error(
  //           `Error downloading chunks for startChunk ${
  //             i * this.MAX_CONCURRENT_PROCESS + 1
  //           } - ${err}`
  //         );
  //         return of(null);
  //       })
  //     )
  //   );

  //   console.log(
  //     'Inside BlobMediaService - 4 - blobsObservables.length = ' +
  //       blobsObservables.length
  //   );
  //   // let blobsObservables2: Observable<Blob[]>[] = [
  //   //   of([new Blob()]).pipe(delay(5000)),
  //   //   of([new Blob()]).pipe(delay(5000)),
  //   //   of([new Blob()]).pipe(delay(5000)),
  //   // ];
  //   return new Observable<string>((observer) => {
  //     concat(blobsObservables)
  //       .pipe(
  //         concatMap((obs) => obs),
  //         catchError((error) => {
  //           console.error('Error downloading blobs:', error);
  //           return of(null);
  //         })
  //       )
  //       .subscribe({
  //         next: (chunks) => {
  //           if (chunks == null) {
  //             observer.error('Error downloading blobs');
  //             observer.complete();
  //             return;
  //           }
  //           console.log(
  //             'Inside BlobMediaService - 5 - chunks.length = ' +
  //               chunks.length +
  //               ', chunks[0].size = ' +
  //               chunks[0].size
  //           );
  //           for (let i = 0; i < chunks.length; i++)
  //             this.videoChunks.push(chunks[i]);
  //         },
  //         complete: () => {
  //           console.log(
  //             'Inside BlobMediaService - 6 - videoChunks.length = ' +
  //               this.videoChunks.length +
  //               ', videoChunks[0].size = ' +
  //               this.videoChunks[0].size
  //           );
  //           observer.next(this.combineChunksAndGetBlobUrl());
  //           observer.complete();
  //         },
  //       });
  //   });
  // }

  getBlobUrl(videoUrl: string, fileSize: number): Observable<string> {
    let totalChunks = 1;
    if (fileSize > this.chunkSize) {
      totalChunks = Math.floor(fileSize / this.chunkSize);
      if (fileSize % this.chunkSize > 0) totalChunks++;
    }

    this.videoChunks = []; // Clear existing chunks

    // return this.downloadChunksAndGetBlobUrl(videoUrl, totalChunks);

    let blobsObservables: Observable<Blob[]>[] = [];
    let i = 0;
    console.log('Inside BlobMediaService - 1 - totalChunks = ' + totalChunks);
    console.log(
      'Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS) = ' +
        Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS)
    );
    for (; i < Math.floor(totalChunks / this.MAX_CONCURRENT_PROCESS); i++) {
      console.log('Inside BlobMediaService - 2 - i = ' + i);
      blobsObservables.push(
        this.downloadChunksAndGetBlobArray2(
          videoUrl,
          this.MAX_CONCURRENT_PROCESS,
          i * this.MAX_CONCURRENT_PROCESS + 1
        )
        // .pipe(
        //   catchError((err) => {
        //     console.error(
        //       `Error downloading chunks for startChunk ${
        //         i * this.MAX_CONCURRENT_PROCESS + 1
        //       } - ${err}`
        //     );
        //     return of(null);
        //   })
        // )
      );
    }
    console.log('Inside BlobMediaService - 3 - i = ' + i);
    blobsObservables.push(
      this.downloadChunksAndGetBlobArray2(
        videoUrl,
        totalChunks % this.MAX_CONCURRENT_PROCESS,
        i * this.MAX_CONCURRENT_PROCESS + 1
      )
      // .pipe(
      //   catchError((err) => {
      //     console.error(
      //       `Error downloading chunks for startChunk ${
      //         i * this.MAX_CONCURRENT_PROCESS + 1
      //       } - ${err}`
      //     );
      //     return of(null);
      //   })
      // )
    );

    console.log(
      'Inside BlobMediaService - 4 - blobsObservables.length = ' +
        blobsObservables.length
    );
    // let blobsObservables2: Observable<Blob[]>[] = [
    //   of([new Blob()]).pipe(delay(5000)),
    //   of([new Blob()]).pipe(delay(5000)),
    //   of([new Blob()]).pipe(delay(5000)),
    // ];
    return new Observable<string>((observer) => {
      from(blobsObservables)
        .pipe(
          concatMap((requests) => forkJoin(requests)),
          catchError((error) => {
            console.error('Error downloading blobs:', error);
            // observer.error('Error downloading blobs');
            // return from([]); // Return an empty observable to complete the sequence
            return of(null);
          })
        )
        .subscribe({
          next: (chunks) => {
            if (!chunks) {
              observer.error('Error downloading blobs');
              observer.complete();
              return;
            }
            console.log(
              'Inside BlobMediaService - 5 - chunks.length = ' + chunks.length //+
              // ', chunks[0].size = ' +
              // chunks[0].size
            );
            chunks.forEach((chunkArray) =>
              this.videoChunks.push(...chunkArray)
            );
          },
          complete: () => {
            console.log(
              'Inside BlobMediaService - 6 - videoChunks.length = ' +
                this.videoChunks.length +
                ', videoChunks[0].size = ' +
                this.videoChunks[0].size
            );
            observer.next(this.combineChunksAndGetBlobUrl());
            observer.complete();
          },
        });
    });
  }

  // private downloadChunksAndGetBlobUrl(
  //   videoUrl: string,
  //   totalChunks: number
  // ): Observable<string> {
  //   const downloadPromises = [];
  //   for (let i = 1; i <= totalChunks; i++) {
  //     downloadPromises.push(this.downloadChunk(i, videoUrl));
  //   }

  //   return new Observable((observer) => {
  //     Promise.all(downloadPromises)
  //       .then((chunks) => {
  //         this.videoChunks = chunks;
  //         observer.next(this.combineChunksAndGetBlobUrl());
  //         observer.complete();
  //       })
  //       .catch((error) => {
  //         console.error('Error downloading chunks:', error);
  //         observer.error('Error downloading chunks:' + error);
  //         observer.complete();
  //       });
  //   });
  // }

  // private downloadChunksAndGetBlobArray(
  //   videoUrl: string,
  //   totalChunks: number,
  //   startChunk: number
  // ): Observable<Blob[]> {
  //   const downloadPromises: Promise<Blob>[] = [];
  //   console.log(
  //     'Inside downloadChunksAndGetBlobArray - 1 - startChunk = ' +
  //       startChunk +
  //       ', totalCunks = ' +
  //       totalChunks
  //   );
  //   for (let i = startChunk; i <= startChunk + totalChunks - 1; i++) {
  //     downloadPromises.push(this.downloadChunk(i, videoUrl));
  //   }

  //   console.log(
  //     'Inside downloadChunksAndGetBlobArray - 2 - downloadPromises.length = ' +
  //       downloadPromises.length
  //   );

  //   return new Observable((observer) => {
  //     Promise.all(downloadPromises)
  //       .then((chunks) => {
  //         console.log(
  //           'Inside downloadChunksAndGetBlobArray - 3 - chunks.length = ' +
  //             chunks.length +
  //             ', chunks[0].size = ' +
  //             chunks[0].size
  //         );
  //         observer.next(chunks);
  //         observer.complete();
  //       })
  //       .catch((error) => {
  //         console.error('Error downloading chunks:', error);
  //         observer.error('Error downloading chunks:' + error);
  //         observer.complete();
  //       });
  //   });
  // }

  private downloadChunksAndGetBlobArray2(
    videoUrl: string,
    totalChunks: number,
    startChunk: number
  ): Observable<Blob[]> {
    // Promise<Blob>[]
    const downloadObservables: Observable<Blob>[] = [];
    console.log(
      'Inside downloadChunksAndGetBlobArray - 1 - startChunk = ' +
        startChunk +
        ', totalCunks = ' +
        totalChunks
    );
    for (let i = startChunk; i <= startChunk + totalChunks - 1; i++) {
      downloadObservables.push(this.downloadChunk2(i, videoUrl));
    }

    console.log(
      'Inside downloadChunksAndGetBlobArray - 2 - downloadPromises.length = ' +
        downloadObservables.length
    );

    return forkJoin(downloadObservables);
  }

  // private downloadChunk(chunkNumber: number, videoUrl: string): Promise<Blob> {
  //   const options = {
  //     headers: new HttpHeaders()
  //       .append('Accept', 'video/mp4')
  //       .append('CHUNK', chunkNumber.toString())
  //       .append('CHUNK-SIZE', this.chunkSize.toString()),
  //     responseType: 'blob' as 'json', // Ensure responseType is set to blob
  //   };
  //   // return this.httpClient.get(videoUrl, options).toPromise() as Promise<Blob>;
  //   return firstValueFrom(this.httpClient.get<Blob>(videoUrl, options));
  // }

  private downloadChunk2(
    chunkNumber: number,
    videoUrl: string
  ): Observable<Blob> {
    const options = {
      headers: new HttpHeaders()
        .append('Accept', 'video/mp4')
        .append('CHUNK', chunkNumber.toString())
        .append('CHUNK-SIZE', this.chunkSize.toString()),
      responseType: 'blob' as 'json', // Ensure responseType is set to blob
    };
    // return this.httpClient.get(videoUrl, options).toPromise() as Promise<Blob>;
    return this.httpClient.get<Blob>(videoUrl, options);
  }

  private combineChunksAndGetBlobUrl(): string {
    const combinedBlob = new Blob(this.videoChunks);
    return window.URL.createObjectURL(combinedBlob);
  }
}
