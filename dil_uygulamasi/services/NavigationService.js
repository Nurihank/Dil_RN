import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef(); /* api dosyamız içinde navigation kullanabilmek için yaptık */

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}