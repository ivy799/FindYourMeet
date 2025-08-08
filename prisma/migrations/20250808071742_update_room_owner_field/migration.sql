/*
  Warnings:

  - You are about to drop the column `room_owner` on the `room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_id,user_id]` on the table `room_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."room" DROP CONSTRAINT "room_room_owner_fkey";

-- AlterTable
ALTER TABLE "public"."room" DROP COLUMN "room_owner",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "image_url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "room_code_key" ON "public"."room"("code");

-- CreateIndex
CREATE UNIQUE INDEX "room_user_room_id_user_id_key" ON "public"."room_user"("room_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."room" ADD CONSTRAINT "room_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
