import React, { useState } from "react";
import styles from './CoursePage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";

const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (ind: number) => {
    setOpenSection(openSection === ind ? null : ind);
  };

  const isUnderlined = (text: string) => {
    const underlinedItems = [
      "Дерево отрезков (ДО)",
      "Дерево Фенwick",
      "Процесс дерева отрезков",
      "Ленивое дерево отрезков"
    ];
    return underlinedItems.includes(text.trim());
  };

  return (
    <div className={styles.course__content}>
      {/* Heading outside the rectangle */}
      <h1 className={styles.title}>Содержание курса</h1>
      
      {/* Rectangle */}
      <div className={styles.rectangle}>
        {courseContent.map((section, index) => (
          <div key={index} className={styles.section}>
            <div 
              className={styles.section__title} 
              onClick={() => toggleSection(index)}
            >
              <div className={styles.circle}>
                <span className={styles.number}>{index + 1}</span>
              </div>
              <h2 className={styles.subtitle}>{section.title}</h2>
              <span className={`${styles.arrow} ${openSection === index ? styles.open : ''}`}></span>
            </div>
            {openSection === index && (
              <ul className={styles.course__box}>
                {section.subSections.map((sub, idx) => (
                  <li
                    key={idx}
                    className={`${styles.listItem} ${isUnderlined(sub) ? styles.underlined : ""} ${styles._listItem_1hgjm_54}`}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
