import { ThemeEngloberService } from '@algotech-ce/business';
import { PairDto, ThemeDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'themeColor' })
export class ThemeColorPipe implements PipeTransform {
    constructor(private themeEnglober: ThemeEngloberService) { }
    transform(theme: ThemeDto, colorKey: string, mode?: 'shade' | 'tint' | 'hover'): string {
        let colors: PairDto[] = [];
        switch (theme.themeKey) {
            case 'light':
                colors = this.themeEnglober.lightTheme;
                break;
            case 'dark':
                colors = this.themeEnglober.darkTheme;
                break;
            default: {
                colors = theme.customColors;
                break;
            }
        }

        const color = colors.find((c) => c.key === colorKey)?.value;
        const bg = colors.find((c) => c.key === 'BACKGROUND')?.value;

        switch (mode) {
            case 'shade':
                return this.themeEnglober.shade(color);
            case 'tint':
                return this.themeEnglober.tint(color);
            case 'hover':
                return this.themeEnglober.hover(bg, color);
            default: return color;
        }
    }
}
