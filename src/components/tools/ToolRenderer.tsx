import React from 'react';
import { motion } from 'framer-motion';
import { Tool } from '../../types/tool';
import { ToolHeader } from '../common/ToolHeader';

// Productivity Tools
import { LoanCalculator } from './productivity/LoanCalculator';
import { BmiCalorieCalculator } from './productivity/BmiCalorieCalculator';
import { TipCalculator } from './productivity/TipCalculator';
import { EventCountdown } from './productivity/EventCountdown';
import { CvBuilder } from './productivity/CvBuilder';
import { PdfTools } from './productivity/PdfTools';
import { InvoiceGenerator } from './productivity/InvoiceGenerator';
import { SignaturePad } from './productivity/SignaturePad';
import { VoiceAudioStudio } from './productivity/VoiceAudioStudio';
import { AmbientSounds } from './productivity/AmbientSounds';
import { DigitalClock } from './productivity/DigitalClock';
import { TypingTest } from './productivity/TypingTest';
import { SpinningWheel } from './productivity/SpinningWheel';
import { DayCounter } from './productivity/DayCounter';
import { VotingSystem } from './productivity/VotingSystem';
import { NameGenerator } from './productivity/NameGenerator';
import { CalendarPlanner } from './productivity/CalendarPlanner';

// Security Tools
import { PasswordGenerator } from './security/PasswordGenerator';
import { UsernameGenerator } from './security/UsernameGenerator';
import { UuidGenerator } from './security/UuidGenerator';
import { HashGenerator } from './security/HashGenerator';
import { JwtDecoder } from './security/JwtDecoder';

// Web Tools
import { ResponsiveTester } from './web/ResponsiveTester';
import { MultiWatchesStudio } from './web/MultiWatchesStudio';
import { QrCodeGenerator } from './web/QrCodeGenerator';
import { UrlShortener } from './web/UrlShortener';
import { UtmBuilder } from './web/UtmBuilder';
import { OgMetaGenerator } from './web/OgMetaGenerator';
import { UrlEncoderDecoder } from './web/UrlEncoderDecoder';

// Text Tools
import { CaseConverter } from './text/CaseConverter';
import { WordCounter } from './text/WordCounter';
import { LoremGenerator } from './text/LoremGenerator';
import { MarkdownPreviewer } from './text/MarkdownPreviewer';
import { Base64Tool } from './text/Base64Tool';

// Design & Graphics Tools
import { WhiteboardSketch } from './design/WhiteboardSketch';
import { ColorPaletteGenerator } from './design/ColorPaletteGenerator';
import { ImageStudio } from './design/ImageStudio';
import { ChartGenerator } from './design/ChartGenerator';
import { GradientGenerator } from './design/GradientGenerator';
import { GlassmorphismGenerator } from './design/GlassmorphismGenerator';
import { CssClampCalculator } from './design/CssClampCalculator';
import { ColorContrastChecker } from './design/ColorContrastChecker';
import { ImageCompressor } from './design/ImageCompressor';

// Developer & Data Tools
import { CodeToImage } from './developer/CodeToImage';
import { SqlFormatter } from './developer/SqlFormatter';
import { CronGenerator } from './developer/CronGenerator';
import { CsvExcelStudio } from './developer/CsvExcelStudio';
import { CurrencyConverter } from './developer/CurrencyConverter';
import { JsonFormatter } from './developer/JsonFormatter';
import { DiffChecker } from './developer/DiffChecker';
import { UnitConverter } from './developer/UnitConverter';
import { TimestampConverter } from './developer/TimestampConverter';
import { RegexTester } from './developer/RegexTester';

interface ToolRendererProps {
  tool: Tool;
  onBack: () => void;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool, onBack }) => {
  const renderToolComponent = () => {
    switch (tool.id) {
      // Productivity & Document
      case 'loan-calculator':
        return <LoanCalculator />;
      case 'bmi-calorie-calculator':
        return <BmiCalorieCalculator />;
      case 'tip-calculator':
        return <TipCalculator />;
      case 'event-countdown':
        return <EventCountdown />;
      case 'cv-builder':
        return <CvBuilder />;
      case 'pdf-tools':
        return <PdfTools />;
      case 'invoice-generator':
        return <InvoiceGenerator />;
      case 'signature-pad':
        return <SignaturePad />;
      case 'voice-audio-studio':
        return <VoiceAudioStudio />;
      case 'ambient-sounds':
        return <AmbientSounds />;
      case 'digital-clock':
        return <DigitalClock />;
      case 'typing-test':
        return <TypingTest />;
      case 'spinning-wheel':
        return <SpinningWheel />;
      case 'day-counter':
        return <DayCounter />;
      case 'voting-system':
        return <VotingSystem />;
      case 'name-generator':
        return <NameGenerator />;
      case 'calendar-planner':
        return <CalendarPlanner />;

      // Security
      case 'password-generator':
        return <PasswordGenerator />;
      case 'username-generator':
        return <UsernameGenerator />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'jwt-decoder':
        return <JwtDecoder />;

      // Web & Streaming
      case 'responsive-tester':
        return <ResponsiveTester />;
      case 'multistream-hub':
        return <MultiWatchesStudio />;
      case 'qr-generator':
        return <QrCodeGenerator />;
      case 'url-shortener':
        return <UrlShortener />;
      case 'utm-builder':
        return <UtmBuilder />;
      case 'og-meta-generator':
        return <OgMetaGenerator />;
      case 'url-encoder-decoder':
        return <UrlEncoderDecoder />;

      // Text
      case 'case-converter':
        return <CaseConverter />;
      case 'word-counter':
        return <WordCounter />;
      case 'lorem-generator':
        return <LoremGenerator />;
      case 'markdown-previewer':
        return <MarkdownPreviewer />;
      case 'base64-tool':
        return <Base64Tool />;

      // Design & Graphics
      case 'whiteboard-sketch':
        return <WhiteboardSketch />;
      case 'color-palette-generator':
        return <ColorPaletteGenerator />;
      case 'image-studio':
        return <ImageStudio />;
      case 'chart-generator':
        return <ChartGenerator />;
      case 'gradient-generator':
        return <GradientGenerator />;
      case 'glassmorphism-generator':
        return <GlassmorphismGenerator />;
      case 'css-clamp-calculator':
        return <CssClampCalculator />;
      case 'contrast-checker':
        return <ColorContrastChecker />;
      case 'image-compressor':
        return <ImageCompressor />;

      // Developer & Data
      case 'code-to-image':
        return <CodeToImage />;
      case 'sql-formatter':
        return <SqlFormatter />;
      case 'cron-generator':
        return <CronGenerator />;
      case 'csv-excel-studio':
        return <CsvExcelStudio />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'diff-checker':
        return <DiffChecker />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'timestamp-converter':
        return <TimestampConverter />;
      case 'regex-tester':
        return <RegexTester />;

      default:
        return (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">Tool component coming soon.</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full pb-16"
    >
      <ToolHeader tool={tool} onBack={onBack} />
      <div>{renderToolComponent()}</div>
    </motion.div>
  );
};
