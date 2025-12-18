// Re-export all admin components
export * from './gallery';
export * from './news';
export * from './facilities';
export * from './student-works';
export * from './achievements';
export * from './kurikulum';
export * from './alumni';

// Import and re-export the components with their default exports
import Gallery from './gallery';
import News from './news';
import Facilities from './facilities';
import StudentWorks from './student-works';
import { Achievements } from './achievements';
import { Kurikulum }from './kurikulum';
import Alumni from './alumni';

export { Gallery, News, Facilities, StudentWorks, Achievements, Kurikulum, Alumni };
