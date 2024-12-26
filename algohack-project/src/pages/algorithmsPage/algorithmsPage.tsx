import React, { useState } from "react";
import styles from "./algorithmsPage.module.scss"
import contents from "../../assets/dataBase/TitlesData.json"
import SegmentTreeVisualizer from "../../visualizations/SegmentTreeVisualizer"

interface Section {
  title: string;
  content?: string;
  subSection?: Section[];
  code?: string; // temp
  visualization?: string; // temp
}

const ContentPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [activeTab, setActiveTab] = useState<"теория" | "код" | "визуализация" | "комплексный анализ" > (
    "теория"  
  );

  const renderSubSection = (subSection?: Section[]) => {
    if (!subSection) return null;

    return (
      <ul>
        {subSection.map((section, index) => (
          <li key={index}>
            <button onClick={() => setActiveSection(section)}>
              {section.title}
            </button>
            {renderSubSection(section.subSection)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={styles.content_page}>
      {/* left panel */}
      <nav className={styles.sidebar}>
        <h3>содержание</h3>
        {
          contents.map((section, index) => (
            <div key={index}>
              <button 
                onClick={() => setActiveSection(section)} 
                className={styles.section}
              >
                {section.title}
              </button>
              {renderSubSection(section.subSection)}
            </div>
          ))
        }
        <button className={styles.back_button}>
          Вернуться к содержанию
        </button>
      </nav>


      {/* Right side */}
      <main className={styles.main}>
        {/* content */}
        {activeSection ? (
          <>
            <h1>{activeSection.title}</h1>
            {activeTab === "теория" && (
              <p>{activeSection.content || "Мы не сделали эту часть ещё :( "}</p>
            )}
            {activeTab === "код" && (
                <pre>
                  <code>{activeSection.code || "Код не добавлен для этой секции"}</code>
                </pre>
              )}
              {activeTab === "визуализация" && (
                <>
                 <SegmentTreeVisualizer />
                 <div>{activeSection.visualization || "Визуализация не доступна"}</div>
                </>
              )}
              {activeTab === "комплексный анализ" && (
                <div>{activeSection.visualization || "Мы всё итак знаем, зачем анализировать"}</div>
              )}
          </>
        ) : (
          <h2>Выберите раздел для просмотра</h2>
        )}

        {/* tabs */}
        <div className={styles.tabs}>
          {["теория", "код", "визуализация", "комплексный анализ" ].map((tab) => (
            <button key={tab} className={`${styles.tab} ${
              activeTab === tab ? styles.active : ""
            }`} onClick={() => setActiveTab(tab as "теория" | "код" | "визуализация" | "комплексный анализ" )}>
              {tab}
            </button>
          ))}
        </div> 
      </main>
    </div>
  )
}

export default ContentPage