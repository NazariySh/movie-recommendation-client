import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../../artists/services/artist.service';
import { AdminArtistsService } from '../../services/admin-artists.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AdminArtistFormDto } from '../../models/admin-models';

@Component({
  selector: 'app-admin-artist-form',
  templateUrl: './admin-artist-form.component.html',
  styleUrl: './admin-artist-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminArtistFormComponent implements OnInit {
  public form!: FormGroup;
  public artistId: string | null = null;
  public loading = false;
  public saving = false;
  public readonly genders = ['Male', 'Female', 'Other'];

  public constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly artistsApi: ArtistService,
    private readonly api: AdminArtistsService,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.artistId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      imdbId: [''],
      tmdbId: [null],
      photoUrl: [''],
      birthday: [null],
      dateOfDeath: [null],
      placeOfBirth: [''],
      nationality: [''],
      gender: [''],
      knownForDepartment: [''],
      biography: [''],
    });

    if (this.artistId) {
      this.loading = true;
      this.cdr.markForCheck();
      this.artistsApi.getArtistById(this.artistId).subscribe({
        next: detail => {
          this.form.patchValue({
            name: detail.name,
            slug: detail.slug,
            imdbId: detail.imdbId,
            tmdbId: detail.tmdbId,
            photoUrl: detail.photoUrl,
            birthday: detail.birthday,
            dateOfDeath: detail.dateOfDeath,
            placeOfBirth: detail.placeOfBirth,
            nationality: detail.nationality,
            gender: detail.gender,
            knownForDepartment: detail.knownForDepartment,
            biography: detail.biography,
          });
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); },
      });
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = this.form.value as AdminArtistFormDto;
    this.saving = true;
    this.cdr.markForCheck();
    if (this.artistId) {
      const id = this.artistId;
      this.api.update(id, dto).subscribe({
        next: () => {
          this.saving = false;
          this.cdr.markForCheck();
          this.toast.success('ADMIN.ARTISTS.UPDATED');
          this.router.navigate(['/admin/artists', id, 'edit']);
        },
        error: () => { this.saving = false; this.cdr.markForCheck(); },
      });
    } else {
      this.api.create(dto).subscribe({
        next: result => {
          this.saving = false;
          this.cdr.markForCheck();
          this.toast.success('ADMIN.ARTISTS.CREATED');
          this.router.navigate(['/admin/artists', result.id, 'edit']);
        },
        error: () => { this.saving = false; this.cdr.markForCheck(); },
      });
    }
  }

  public cancel(): void { this.router.navigate(['/admin/artists']); }
}
