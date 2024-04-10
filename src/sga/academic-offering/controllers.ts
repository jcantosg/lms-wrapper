import { academicPeriodControllers } from '#academic-offering/infrastructure/controller/academic-period/controllers';
import { academicProgramControllers } from '#academic-offering/infrastructure/controller/academic-program/controllers';
import { evaluationTypesController } from '#academic-offering/infrastructure/controller/evaluation-type/controllers';
import { subjectControllers } from '#academic-offering/infrastructure/controller/subject/controllers';
import { titleControllers } from '#academic-offering/infrastructure/controller/title/controllers';
import { examinationCallControllers } from '#academic-offering/infrastructure/controller/examination-call/controllers';
import { programBlockControllers } from '#academic-offering/infrastructure/controller/program-block/controllers';

export const controllers = [
  ...academicPeriodControllers,
  ...academicProgramControllers,
  ...examinationCallControllers,
  ...evaluationTypesController,
  ...subjectControllers,
  ...titleControllers,
  ...programBlockControllers,
];
