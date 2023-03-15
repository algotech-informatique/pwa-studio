import { AppTemplateCategoryDto } from '../../dto/app-template-category.dto';
import { board } from './board/board';
import { buttonIconLauncher } from './buttons/icon/button-icon-launcher';
import { buttonIconMore } from './buttons/icon/button-icon-more';
import { buttonIconPlus } from './buttons/icon/button-icon-plus';
import { buttonClearPrimary } from './buttons/simple/button-clear-primary';
import { buttonClearPrimaryRound } from './buttons/simple/button-clear-primary-round';
import { buttonOutinePrimaryRound } from './buttons/simple/button-outine-primary-round';
import { buttonOutlinePrimary } from './buttons/simple/button-outline-primary';
import { buttonSolidPrimary } from './buttons/simple/button-solid-primary';
import { buttonSolidPrimaryRound } from './buttons/simple/button-solid-primary-round';
import { buttonEmail } from './buttons/style/button-email';
import { buttonPlay } from './buttons/style/button-play';
import { carousell } from './document/carousell';
import { documents } from './document/documents';
import { gallery } from './document/gallery';
import { image } from './document/image';
import { roundImage } from './document/round-image';
import { footerWebSimple } from './footer/footer-web-simple';
import { footerMobileTabs } from './footer/footer-mobile-tabs';
import { headerMobile } from './header/header-mobile';
import { headerWebWideTabsSolid } from './header/header-web-wide-tabs-solid';
import { dashCircle } from './shapes/dash-circle';
import { fullCircle } from './shapes/full-circle';
import { fullRectangle } from './shapes/full-rectangle';
import { fullSquare } from './shapes/full-square';
import { roundRectangle } from './shapes/round-rectangle';
import { roundSquare } from './shapes/round-square';
import { notification } from './system/notification/notification';
import { roundNotification } from './system/notification/round-notification';
import { squareNotification } from './system/notification/square-notification';
import { profil } from './system/profile/profil';
import { roundProfil } from './system/profile/round-profil';
import { squareProfil } from './system/profile/square-profil';
import { mobileSelector } from './system/selector/mobile-selector';
import { roundSelector } from './system/selector/round-selector';
import { selector } from './system/selector/selector';
import { squareSelector } from './system/selector/square-selector';
import { tabClearMobile } from './tabs/tab-clear-mobile';
import { tabClearUnderline } from './tabs/tab-clear-underline';
import { tabClearVertical } from './tabs/tab-clear-vertical';
import { tabSolid } from './tabs/tab-solid';
import { tabSolidVertical } from './tabs/tab-solid-vertical';
import { bigTitle } from './text/big-title';
import { italicTitle } from './text/italic-title';
import { paragraphe } from './text/paragraphe';
import { paragrapheItalic } from './text/paragraphe-italic';
import { simpleTitle } from './text/simple-title';
import { title } from './text/title';
import { headerMobileAction } from './header/header-mobile-action';
import { headerWebMin } from './header/header-web-min';
import { headerMobileMin } from './header/header-mobile-min';
import { headerWebWideTabsUnderline } from './header/header-web-wide-tabs-underline';
import { footerMobileTabsIconOnly } from './footer/footer-mobile-tabs-icon-only';
import { headerWebBlank } from './header/header-web-blank';
import { headerMobileBlank } from './header/header-mobile-blank';
import { footerMobileBlank } from './footer/footer-mobile-blank';
import { footerWebBlank } from './footer/footer-web-blank';
import { tabSolidRadius } from './tabs/tab-solid-radius';
import { tabSolidButtonsRadius } from './tabs/tab-solid-buttons-radius';
import { tableColorHeader } from './table/table-color-header';
import { tableSimple } from './table/table-simple';

export const templatesLibrary: AppTemplateCategoryDto[] = [
    {
        key: 'button',
        displayName: 'APP-TEMPLATE-BUTTON',
        icon: 'fa-solid fa-hand-pointer',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-BUTTON-STANDARD',
                colCount: 2,
                widgets: [
                    buttonSolidPrimary,
                    buttonSolidPrimaryRound,
                    buttonOutlinePrimary,
                    buttonOutinePrimaryRound,
                    buttonClearPrimary,
                    buttonClearPrimaryRound
                ]
            },
            {
                displayName: 'APP-TEMPLATE-BUTTON-ICON',
                colCount: 3,
                widgets: [
                    buttonIconLauncher,
                    buttonIconPlus,
                    buttonIconMore
                ]
            },
            {
                displayName: 'APP-TEMPLATE-BUTTON-CUSTOM',
                colCount: 2,
                widgets: [
                    buttonPlay,
                    buttonEmail
                ]
            },
        ]
    },
    {
        key: 'image',
        displayName: 'APP-TEMPLATE-IMAGE',
        icon: 'fa-solid fa-image',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-IMAGE-STANDARD',
                colCount: 2,
                widgets: [
                    image,
                    roundImage,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-IMAGE-GALLERY',
                colCount: 1,
                widgets: [
                    gallery,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-IMAGE-CAROUSSEL',
                colCount: 1,
                widgets: [
                    carousell,
                ]
            },
        ]
    },
    {
        key: 'text',
        displayName: 'APP-TEMPLATE-TEXT',
        icon: 'fa-solid fa-font',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-TEXT-TITLE',
                colCount: 1,
                reverseColor: true,
                widgets: [
                    title,
                    simpleTitle,
                    italicTitle,
                    bigTitle,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-TEXT-PARAGRAPH',
                colCount: 1,
                reverseColor: true,
                widgets: [
                    paragraphe,
                    paragrapheItalic
                ]
            },
        ]
    },
    {
        key: 'tab',
        displayName: 'APP-TEMPLATE-TAB',
        icon: 'fa-solid fa-sitemap',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-TAB-H',
                colCount: 1,
                widgets: [
                    tabSolid,
                    tabSolidRadius,
                    tabSolidButtonsRadius,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-TAB-H-CLEAR',
                colCount: 1,
                reverseColor: true,
                widgets: [
                    tabClearUnderline,
                    tabClearMobile,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-TAB-V',
                colCount: 1,
                widgets: [
                    tabClearVertical,
                    tabSolidVertical
                ]
            },
        ]
    },
    {
        key: 'document',
        displayName: 'APP-TEMPLATE-DOCUMENT',
        platform: ['mobile', 'web'],
        icon: 'fa-solid fa-copy',
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-DOCUMENT-LIST',
                colCount: 1,
                widgets: [
                    documents
                ]
            },
        ]
    },
    {
        key: 'shapes',
        displayName: 'APP-TEMPLATE-SHAPE',
        icon: 'fa-solid fa-shapes',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-SHAPE-CIRCLE',
                colCount: 2,
                widgets: [
                    dashCircle,
                    fullCircle
                ]
            },
            {
                displayName: 'APP-TEMPLATE-SHAPE-RECTANGLE',
                colCount: 2,
                widgets: [
                    fullSquare,
                    fullRectangle,
                    roundSquare,
                    roundRectangle
                ]
            },
        ]
    },
    {
        key: 'board',
        icon: 'fa-solid fa-columns',
        displayName: 'APP-TEMPLATE-BOARD',
        platform: ['mobile', 'web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-BOARD',
                colCount: 1,
                widgets: [
                    board
                ]
            },
        ]
    },
    {
        key: 'system',
        icon: 'fa-solid fa-cog',
        displayName: 'APP-TEMPLATE-SYSTEM',
        platform: ['web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-NOTIFICATION',
                colCount: 3,
                widgets: [
                    notification,
                    squareNotification,
                    roundNotification,
                ]
            },{
                displayName: 'APP-TEMPLATE-PROFILE',
                colCount: 3,
                widgets: [
                    profil,
                    squareProfil,
                    roundProfil,
                ]
            },{
                displayName: 'APP-TEMPLATE-SELECTOR',
                colCount: 3,
                widgets: [
                    selector,
                    squareSelector,
                    roundSelector,
                ]
            },
        ]
    },
    {
        key: 'system-mobile',
        icon: 'fa-solid fa-cog',
        displayName: 'APP-TEMPLATE-SYSTEM',
        platform: ['mobile'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-SELECTOR',
                colCount: 3,
                widgets: [
                    mobileSelector,
                ]
            },
        ]
    },
    {
        key: 'header-web',
        icon: 'fa-solid fa-window-maximize',
        displayName: 'APP-TEMPLATE-HEADER',
        platform: ['web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-HEADER-BLANK',
                colCount: 1,
                widgets: [
                    headerWebBlank,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-HEADER-NAVIGATION',
                colCount: 1,
                widgets: [
                    headerWebWideTabsSolid,
                    headerWebWideTabsUnderline,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-HEADER-MINIMALIST',
                colCount: 2,
                widgets: [
                    headerWebMin,
                ]
            }
        ]
    },
    {
        key: 'header-mobile',
        icon: 'fa-solid fa-window-maximize',
        displayName: 'APP-TEMPLATE-HEADER',
        platform: ['mobile'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-HEADER-BLANK',
                colCount: 1,
                widgets: [
                    headerMobileBlank,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-HEADER-WITH -TITLE',
                colCount: 1,
                widgets: [
                    headerMobile,
                    headerMobileAction,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-HEADER-MINIMALIST',
                colCount: 3,
                widgets: [
                    headerMobileMin,
                ]
            }
        ]
    },
    {
        key: 'footer-mobile',
        icon: 'fa-solid fa-window-maximize fa-rotate-180',
        displayName: 'APP-TEMPLATE-FOOTER',
        platform: ['mobile'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-HEADER-BLANK',
                colCount: 1,
                widgets: [
                    footerMobileBlank,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-HEADER-NAVIGATION',
                colCount: 1,
                widgets: [
                    footerMobileTabs,
                    footerMobileTabsIconOnly,
                ]
            },
        ]
    },
    {
        key: 'footer-web',
        icon: 'fa-solid fa-window-maximize fa-rotate-180',
        displayName: 'APP-TEMPLATE-FOOTER',
        platform: ['web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-HEADER-BLANK',
                colCount: 1,
                widgets: [
                    footerWebBlank,
                ]
            },
            {
                displayName: 'APP-TEMPLATE-FOOTER',
                colCount: 1,
                widgets: [
                    footerWebSimple,
                ]
            },
        ]
    },
    {
        key: 'table',
        icon: 'fa-solid fa-table',
        displayName: 'APP-TEMPLATE-TABLE',
        platform: ['web'],
        subCategories: [
            {
                displayName: 'APP-TEMPLATE-TABLE',
                colCount: 1,
                widgets: [
                    tableColorHeader,
                    tableSimple,
                ]
            }
        ]
    }
];
