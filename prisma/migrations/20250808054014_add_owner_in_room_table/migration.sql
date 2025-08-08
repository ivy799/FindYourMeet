/*
  Warnings:

  - Added the required column `room_owner` to the `room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."room" ADD COLUMN     "room_owner" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."room" ADD CONSTRAINT "room_room_owner_fkey" FOREIGN KEY ("room_owner") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
