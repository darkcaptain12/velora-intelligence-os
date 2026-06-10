-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('OPENAI', 'FAL', 'ANTHROPIC', 'SHOPIFY', 'META', 'SMTP');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('TIKTOK', 'PINTEREST', 'ETSY', 'AMAZON', 'REDDIT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'FAILED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "MockupType" AS ENUM ('TSHIRT', 'HOODIE', 'SWEATSHIRT', 'OVERSIZE');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('TIKTOK', 'REEL', 'STORY', 'UGC');

-- CreateEnum
CREATE TYPE "LifecycleStatus" AS ENUM ('NEW', 'TEST', 'WINNER', 'SCALING', 'DECLINING', 'CLOSED');

-- CreateEnum
CREATE TYPE "MailDir" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MailStatus" AS ENUM ('DRAFT', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('API_INPUT', 'APPROVE_DESIGN', 'APPROVE_AD', 'GENERIC');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LimitPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('DATABASE', 'WORKFLOW', 'ASSETS');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('WEEKLY', 'CEO', 'FINANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "taxRate" DECIMAL(5,4) NOT NULL DEFAULT 0.20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiCredential" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "keyEncrypted" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "payload" JSONB,
    "autonomyLevel" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchRun" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "source" "Source" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "query" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ResearchRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchResult" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "demandScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "competitionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salesPotential" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" "Source" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorProduct" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "url" TEXT,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorAd" (
    "id" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "creativeUrl" TEXT,
    "copy" TEXT,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignBrief" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "trendRefs" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "briefId" TEXT,
    "prompt" TEXT NOT NULL,
    "svgUrl" TEXT,
    "pngUrl" TEXT,
    "transparentUrl" TEXT,
    "printReadyUrl" TEXT,
    "scores" JSONB,
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mockup" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "type" "MockupType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mockup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "productId" TEXT,
    "type" "VideoType" NOT NULL,
    "url" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "LifecycleStatus" NOT NULL DEFAULT 'NEW',
    "designId" TEXT,
    "shopifyId" TEXT,
    "cost" DECIMAL(12,2),
    "price" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductLifecycleEvent" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "from" "LifecycleStatus" NOT NULL,
    "to" "LifecycleStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductLifecycleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyCollection" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "shopifyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopifyCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyHealthCheck" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopifyHealthCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "dailyBudget" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSet" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "budget" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "adsetId" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "creativeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdMetric" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "spend" DECIMAL(12,2) NOT NULL,
    "roas" DOUBLE PRECISION,
    "cpa" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "ctr" DOUBLE PRECISION,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreativeTest" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "variants" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "winner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreativeTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "supplierId" TEXT,
    "direction" "MailDir" NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "MailStatus" NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "shopifyId" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "financialStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceSnapshot" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "adSpend" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cogs" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "shipping" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "commission" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "opex" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grossProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "netProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxEstimate" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "aov" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationScore" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "adScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seoScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overall" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIReport" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "period" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "insights" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL DEFAULT 'GENERIC',
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "queue" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpendLimit" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "period" "LimitPeriod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpendLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "type" "BackupType" NOT NULL,
    "location" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "model" TEXT NOT NULL,
    "tokensIn" INTEGER,
    "tokensOut" INTEGER,
    "cost" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ApiCredential_brandId_provider_key" ON "ApiCredential"("brandId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_brandId_key_key" ON "Setting"("brandId", "key");

-- CreateIndex
CREATE INDEX "AuditLog_brandId_createdAt_idx" ON "AuditLog"("brandId", "createdAt");

-- CreateIndex
CREATE INDEX "ResearchRun_brandId_source_idx" ON "ResearchRun"("brandId", "source");

-- CreateIndex
CREATE INDEX "ResearchResult_runId_idx" ON "ResearchResult"("runId");

-- CreateIndex
CREATE INDEX "Trend_brandId_week_idx" ON "Trend"("brandId", "week");

-- CreateIndex
CREATE INDEX "Competitor_brandId_idx" ON "Competitor"("brandId");

-- CreateIndex
CREATE INDEX "CompetitorProduct_competitorId_seenAt_idx" ON "CompetitorProduct"("competitorId", "seenAt");

-- CreateIndex
CREATE INDEX "CompetitorAd_competitorId_seenAt_idx" ON "CompetitorAd"("competitorId", "seenAt");

-- CreateIndex
CREATE INDEX "DesignBrief_brandId_idx" ON "DesignBrief"("brandId");

-- CreateIndex
CREATE INDEX "Design_brandId_status_idx" ON "Design"("brandId", "status");

-- CreateIndex
CREATE INDEX "Mockup_brandId_idx" ON "Mockup"("brandId");

-- CreateIndex
CREATE INDEX "Mockup_designId_idx" ON "Mockup"("designId");

-- CreateIndex
CREATE INDEX "Video_brandId_status_idx" ON "Video"("brandId", "status");

-- CreateIndex
CREATE INDEX "Product_brandId_status_idx" ON "Product"("brandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Product_brandId_shopifyId_key" ON "Product"("brandId", "shopifyId");

-- CreateIndex
CREATE INDEX "ProductLifecycleEvent_productId_idx" ON "ProductLifecycleEvent"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyCollection_brandId_shopifyId_key" ON "ShopifyCollection"("brandId", "shopifyId");

-- CreateIndex
CREATE INDEX "ShopifyHealthCheck_brandId_type_idx" ON "ShopifyHealthCheck"("brandId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "AdCampaign_brandId_metaId_key" ON "AdCampaign"("brandId", "metaId");

-- CreateIndex
CREATE INDEX "AdSet_campaignId_idx" ON "AdSet"("campaignId");

-- CreateIndex
CREATE INDEX "Ad_adsetId_idx" ON "Ad"("adsetId");

-- CreateIndex
CREATE INDEX "AdMetric_brandId_date_idx" ON "AdMetric"("brandId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AdMetric_brandId_level_refId_date_key" ON "AdMetric"("brandId", "level", "refId", "date");

-- CreateIndex
CREATE INDEX "CreativeTest_brandId_status_idx" ON "CreativeTest"("brandId", "status");

-- CreateIndex
CREATE INDEX "Supplier_brandId_idx" ON "Supplier"("brandId");

-- CreateIndex
CREATE INDEX "EmailMessage_brandId_status_idx" ON "EmailMessage"("brandId", "status");

-- CreateIndex
CREATE INDEX "Order_brandId_createdAt_idx" ON "Order"("brandId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_brandId_shopifyId_key" ON "Order"("brandId", "shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceSnapshot_brandId_date_key" ON "FinanceSnapshot"("brandId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "OperationScore_brandId_date_key" ON "OperationScore"("brandId", "date");

-- CreateIndex
CREATE INDEX "AIReport_brandId_type_idx" ON "AIReport"("brandId", "type");

-- CreateIndex
CREATE INDEX "Task_brandId_status_idx" ON "Task"("brandId", "status");

-- CreateIndex
CREATE INDEX "Job_queue_status_idx" ON "Job"("queue", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SpendLimit_brandId_period_key" ON "SpendLimit"("brandId", "period");

-- CreateIndex
CREATE INDEX "UsageLog_brandId_createdAt_idx" ON "UsageLog"("brandId", "createdAt");

-- AddForeignKey
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchRun" ADD CONSTRAINT "ResearchRun_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchResult" ADD CONSTRAINT "ResearchResult_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ResearchRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trend" ADD CONSTRAINT "Trend_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorProduct" ADD CONSTRAINT "CompetitorProduct_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAd" ADD CONSTRAINT "CompetitorAd_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignBrief" ADD CONSTRAINT "DesignBrief_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "DesignBrief"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mockup" ADD CONSTRAINT "Mockup_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mockup" ADD CONSTRAINT "Mockup_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLifecycleEvent" ADD CONSTRAINT "ProductLifecycleEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyCollection" ADD CONSTRAINT "ShopifyCollection_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopifyHealthCheck" ADD CONSTRAINT "ShopifyHealthCheck_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdCampaign" ADD CONSTRAINT "AdCampaign_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdSet" ADD CONSTRAINT "AdSet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_adsetId_fkey" FOREIGN KEY ("adsetId") REFERENCES "AdSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdMetric" ADD CONSTRAINT "AdMetric_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeTest" ADD CONSTRAINT "CreativeTest_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceSnapshot" ADD CONSTRAINT "FinanceSnapshot_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationScore" ADD CONSTRAINT "OperationScore_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReport" ADD CONSTRAINT "AIReport_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendLimit" ADD CONSTRAINT "SpendLimit_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
